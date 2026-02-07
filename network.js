export function monitorNetwork(conn, stat) {

	conn.exec(`
		INTERFACE=$(ip route | grep default | awk '{print $5}' | head -n1)
		while true; do
			R1=$(cat /proc/net/dev | grep $INTERFACE | awk '{print $2}')
			T1=$(cat /proc/net/dev | grep $INTERFACE | awk '{print $10}')
			sleep 1
			R2=$(cat /proc/net/dev | grep $INTERFACE | awk '{print $2}')
			T2=$(cat /proc/net/dev | grep $INTERFACE | awk '{print $10}')
			TX_SPEED=$(( (T2 - T1) / 1024 ))
			RX_SPEED=$(( (R2 - R1) / 1024 ))
			echo "$TX_SPEED $RX_SPEED"
		done
	`, (err, stream) => {
		if (err) throw err;
		stream.on('data', (data) => {
			if (!stat) return
			let net = data.toString().trim().split(" ")
			stat.network.uploadSpeed = net[0]
			stat.network.downloadSpeed = net[1]
		}).stderr.on('data', (data) => {
			console.log('STDERR: ' + data)
		})
	})
}
