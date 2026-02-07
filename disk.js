export function monitorDisk(conn, stat) {
	conn.exec(`vmstat 1 | awk -W interactive '{print $9 " " $10}'`, (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let disk = data.toString().trim().split(" ")
			stat.disk.readSpeed = disk[0]
			stat.disk.writeSpeed = disk[1]
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})
}
