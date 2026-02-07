import express from 'express'
import path from 'path'
import Database from 'better-sqlite3'
import fs from 'fs'
import { Client } from 'ssh2'
import { monitorCPU } from './cpu.js'
import { monitorMemory } from './memory.js'
import { monitorNetwork } from './network.js'
import { monitorDisk } from './disk.js'
import { monitorDocker } from './docker.js'

if (!fs.existsSync('./data')) {
	fs.mkdirSync('./data')
}

const db = new Database('./data/data.db');
db.exec(`CREATE TABLE IF NOT EXISTS hosts (id TEXT NOT NULL, label TEXT NOT NULL, host TEXT NOT NULL, user TEXT NOT NULL, password TEXT NOT NULL, privkey TEXT NOT NULL)`)

const app = express()
app.use(express.json())
app.use(express.static('./public'))
app.use(express.static('./static'))

app.get('/', (req, res) => {
	res.redirect('/list.html')
})

app.post('/addHost', (req, res) => {
	const body = req.body
	db.prepare(`INSERT INTO hosts VALUES(?, ?, ?, ?, ?, ?)`).run([body.id, body.label, body.host, body.user, body.password, body.privkey])
	const h = {
		id: body.id,
		label: body.label,
		host: body.host,
		user: body.user,
		password: body.password,
		privkey: body.privkey
	}
	connectToHost(h)
	res.sendStatus(200)
})

app.post('/editHost', (req, res) => {
	const body = req.body
	db.prepare(`
		UPDATE hosts 
		SET label = @label, 
			host = @host, 
			user = @user,
			password = @password,
			privkey = @privkey
		WHERE id = @id
	`).run({
		label: body.label,
		host: body.host,
		user: body.user,
		password: body.password,
		privkey: body.privkey,
		id: body.id
	});

	let ins = instances.get(body.id);
	if (ins) {
			if (ins.interval) clearInterval(ins.interval)
			if (ins.db) ins.db.close()
			if (ins.conn) {
					ins.conn.removeAllListeners('close')
					ins.conn.destroy()
			}
	}
	connectToHost(body);
	res.sendStatus(200)
})

app.post('/getHosts', (req, res) => {
	res.json(db.prepare(`SELECT * FROM hosts`).all())
})

app.post('/deleteHost', (req, res) => {
	const body = req.body
	res.json(db.prepare(`DELETE FROM hosts WHERE id = ?`).run([body.id]))
	let ins = instances.get(req.body.id)
	clearInterval(ins.interval)
	ins.db.close()
	ins.conn.destroy()
	fs.unlinkSync(`./data/${body.id}.db`)
})

app.post('/cpu', (req, res) => {
	res.json(stats.get(req.body.id).cpu)
})

app.post('/memory', (req, res) => {
	res.json(stats.get(req.body.id).memory)
})

app.post('/network', (req, res) => {
	res.json(stats.get(req.body.id).network)
})

app.post('/disk', (req, res) => {
	res.json(stats.get(req.body.id).disk)
})

app.post('/docker', (req, res) => {
	res.json(stats.get(req.body.id).docker)
})

app.post('/stopDocker', (req, res) => {
	let body = req.body
	let conn = instances.get(body.id).conn
	conn.exec(`docker stop ${body.containerId}`, (err, stream) => {
		if (err) {
			console.log("STOP DOCKER ERROR")
			console.log(err)
		}
		res.sendStatus(200)
	})
})

app.post('/startDocker', (req, res) => {
	let body = req.body
	let conn = instances.get(body.id).conn
	
	if (body.state == "exited") {
		//start
		conn.exec(`docker start ${body.containerId}`, (err, stream) => {
			if (err) {
				console.log("START DOCKER ERROR")
				console.log(err)
			}
			res.sendStatus(200)
		})
	} else {
		//restart
		conn.exec(`docker restart ${body.containerId}`, (err, stream) => {
			if (err) {
				console.log("RESTART DOCKER ERROR")
				console.log(err)
			}
			res.sendStatus(200)
		})
	}
})

let instances = new Map()
app.post('/instanceData', (req, res) => {
	let body = req.body
	let idb = instances.get(body.id).db
	if (body.dataType == "cpu") {
		res.json({type: "cpu", data: idb.prepare(`
		SELECT time, data FROM (
			SELECT *, 
						 NTILE(60) OVER (ORDER BY time ASC) as bucket
			FROM cpu 
			WHERE time > ? AND time < ?
			) 
		GROUP BY bucket
		`).all(body.timeFrom, body.timeTo)})
	}
	if (body.dataType == "memory") {
		res.json({type: "memory", data: idb.prepare(`
		SELECT time, data FROM (
			SELECT *, 
						 NTILE(60) OVER (ORDER BY time ASC) as bucket
			FROM memory 
			WHERE time > ? AND time < ?
			) 
		GROUP BY bucket
		`).all(body.timeFrom, body.timeTo)})
	}
	if (body.dataType == "network") {
		res.json({type: "network", data: idb.prepare(`
		SELECT time, data FROM (
			SELECT *, 
						 NTILE(60) OVER (ORDER BY time ASC) as bucket
			FROM network 
			WHERE time > ? AND time < ?
			) 
		GROUP BY bucket
		`).all(body.timeFrom, body.timeTo)})
	}
	if (body.dataType == "disk") {
		res.json({type: "disk", data: idb.prepare(`
		SELECT time, data FROM (
			SELECT *, 
						 NTILE(60) OVER (ORDER BY time ASC) as bucket
			FROM disk 
			WHERE time > ? AND time < ?
			) 
		GROUP BY bucket
		`).all(body.timeFrom, body.timeTo)})
	}
})

let hosts = db.prepare(`SELECT * FROM hosts`).all()
let stats = new Map()

function connectToHost(h) {

		if (!stats.has(h.id)) {
			stats.set(h.id, {
				cpu: {
					//static
					name: '',
					arch: '',
					type: '',
					sockets: 0,
					cores: 0,
					threads: 0,
					l1d: 0,
					l1i: 0,
					l2: 0,
					l3: 0,
					//dyanamic
					userTime: 0,
					systemTime: 0
				},
				memory: {
					used: 0,
					free: 1,
					swapUsed: 0,
					swapFree: 1
				},
				network: {
					uploadSpeed: 0,
					downloadSpeed: 0
				},
				disk: {
					readSpeed: 0,
					writeSpeed: 0
				},
				docker: {}
			})
		}

		function connect() {

			//instance db
			const idb = new Database(`./data/${h.id}.db`)
			idb.exec(`CREATE TABLE IF NOT EXISTS cpu (time INTEGER NOT NULL, data TEXT NOT NULL)`)
			idb.exec(`CREATE TABLE IF NOT EXISTS memory (time INTEGER NOT NULL, data TEXT NOT NULL)`)
			idb.exec(`CREATE TABLE IF NOT EXISTS network (time INTEGER NOT NULL, data TEXT NOT NULL)`)
			idb.exec(`CREATE TABLE IF NOT EXISTS disk (time INTEGER NOT NULL, data TEXT NOT NULL)`)
			const conn = new Client();
			instances.set(h.id, {db: idb, conn, interval: null})
			let stat = stats.get(h.id)

			conn.on('ready', () => {
				monitorCPU(conn, stat)
				monitorMemory(conn, stat)
				monitorNetwork(conn, stat)
				monitorDisk(conn, stat)
				monitorDocker(conn, stat, h.id)
				//store these data for statistics
				let intervalID = setInterval(()=>{
					idb.prepare(`INSERT INTO cpu VALUES(?, ?)`).run(Date.now(), JSON.stringify({userTime: stat.cpu.userTime, systemTime: stat.cpu.systemTime}))
					idb.prepare(`INSERT INTO memory VALUES(?, ?)`).run(Date.now(), JSON.stringify({used: stat.memory.used, free: stat.memory.free, swapUsed: stat.memory.swapUsed, swapFree: stat.memory.swapFree}))
					idb.prepare(`INSERT INTO network VALUES(?, ?)`).run(Date.now(), JSON.stringify({uploadSpeed: stat.network.uploadSpeed, downloadSpeed: stat.network.downloadSpeed}))
					idb.prepare(`INSERT INTO disk VALUES(?, ?)`).run(Date.now(), JSON.stringify({readSpeed: stat.disk.readSpeed, writeSpeed: stat.disk.writeSpeed}))
				}, 10000)
				instances.get(h.id).interval = intervalID
			}).on('error', (err) => {
				console.log(err)
			}).on('close', () => {
				console.log('closed')
				connect()
			}).connect({
				host: h.host,
				port: 22,
				username: h.user,
				password: h.password
			})

		}
		connect()

}

for (let h of hosts) {
	connectToHost(h)
}

app.listen(80, function() {
	console.log("server running")
})
