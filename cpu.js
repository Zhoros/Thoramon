export function monitorCPU(conn, stat, db) {
	//TODO: parse /proc/spuinfo instead of lscpu
	conn.exec('lscpu', (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let cpuInfo = data.toString()
			stat.cpu.name = cpuInfo.match(/Model name:\s*(.*)$/m)[1].trim()
			stat.cpu.arch = cpuInfo.match(/Architecture:\s*(.*)$/m)[1].trim()
			stat.cpu.sockets = cpuInfo.match(/Socket\(s\):\s*(.*)$/m)[1].trim()
			stat.cpu.cores = cpuInfo.match(/Core\(s\) per socket:\s*(.*)$/m)[1].trim()
			stat.cpu.threads = cpuInfo.match(/Thread\(s\) per core:\s*(.*)$/m)[1].trim()
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})

	//Get VM/Physical
	conn.exec('grep -m 1 "flags" /proc/cpuinfo | grep -q "hypervisor" && echo "VM" || echo "Physical"', (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let result = data.toString().trim()
			stat.cpu.type = result
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})

	//Get CPU Memory stats
	conn.exec('cat /sys/devices/system/cpu/cpu0/cache/index*/size', (err, stream) => {
		if (err) throw err;
		let result = ""
		stream.on('data', (data) => {
			if (!stat) return
			result += data.toString()
		}).on('close', () => {
			if (!stat) return
			const lines = result.trim().split('\n');
			stat.cpu.l1d = lines[0];
			stat.cpu.l1i = lines[1];
			stat.cpu.l2  = lines[2];
			stat.cpu.l3  = lines[3];
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})

	//TODO: parse /proc/stat instead of lscpu
	conn.exec(`vmstat -n 2 | awk -W interactive 'NR > 2 {print $13, $14}'`, (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let nums = data.toString().trim().split(" ")
			stat.cpu.userTime = nums[0]
			stat.cpu.systemTime = nums[1]
		}).stderr.on('data', (data) => {
			console.log('ERROR: ' + data)
		})
	})
}
