export function monitorMemory(conn, stat) {

	conn.exec(`free -s 2 | awk -W interactive '/Mem:/ {m_u=$2-$4-$6; m_a=$2} /Swap:/ {print m_u, m_a-m_u, $3, $4;fflush()}'`, (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let mem = data.toString().trim().split(" ")
			//need this check because the network sometimes send empty string not sure why
			if (mem.length == 4) {
				stat.memory.used = Number(mem[0])
				stat.memory.free = Number(mem[1])
				stat.memory.swapUsed = Number(mem[2])
				stat.memory.swapFree = Number(mem[3])
			}
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})
}
