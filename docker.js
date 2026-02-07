export function monitorDocker(conn, stat, id) {
    const cmd = `while true; do curl -sS --unix-socket /var/run/docker.sock http://v1.41/containers/json?all=true; echo "---DATA_BOUNDARY---"; sleep 2; done`;
    conn.exec(cmd, (err, stream) => {
			if (err) throw err;
			let buffer = '';
			stream.on('data', (data) => {
					buffer += data.toString();
					if (buffer.includes("---DATA_BOUNDARY---")) {
							const parts = buffer.split("---DATA_BOUNDARY---");
							const rawJson = parts[parts.length - 2].trim();
							if (rawJson) {
									try {
										const containers = JSON.parse(rawJson);
										stat.docker = containers.map(c => ({
											id,
											containerId: c.Id.substring(0, 12),
											name: c.Names[0]?.replace(/^\//, '') || 'unknown',
											status: c.Status,
											state: c.State
										}));
									} catch (e) {
										console.error("Partial JSON or Parse Error");
									}
							}
						buffer = parts[parts.length - 1];
					}
			});

			stream.stderr.on('data', (data) => {
				console.log('STDERR: ' + data);
			});
    });
}
