<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post } from './helper.js'
	import { Chart } from 'chart.js/auto'
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import Sidebar from './sidebar.svelte'
	import Memory from './memory.svelte'

	Chart.register(ChartDataLabels);
	const id = new URLSearchParams(window.location.search).get('id')

	let cpuCanvas
	let cpuInfo = {}
	onMount(() => {

		let CPUChart = new Chart(cpuCanvas, {
			type: 'pie',
			data: {
				labels: ['User', 'System', 'Free'],
				datasets: [{
					label: 'CPU Usage %',
					data: [1,0,0],
					backgroundColor: [
							'rgba(255, 99, 132, 0.7)',
							'rgba(255, 205, 86, 0.7)',
							'rgba(75, 192, 192, 0.7)'
					],
					borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)'
					],
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value) => {
										return value > 5 ? value.toFixed(1) + '%' : null;
                }
            },
            legend: {
                position: 'bottom'
            }
        }
			}
		})

		function updateCPU() {
			post('/cpu', {id}, (res) => {
				cpuInfo = res
				CPUChart.data.datasets[0].data = [res.userTime, res.systemTime, 100 - res.userTime - res.systemTime]
				CPUChart.update()
			})
		}

		updateCPU()
		setInterval(() => {
			updateCPU()
		}, 2000)

	})

</script>

<div style="display: flex; gap: 10px; flex-wrap: wrap">

		<div style="width: 250px; height: 250px">
			<canvas bind:this={cpuCanvas}></canvas>
		</div>
		<div style="display: flex; flex-direction: column">
			<div>
				<b><span>{cpuInfo.name}</span></b>
			</div>
			<div>
				<span>Architecture: </span>
				<b><span>{cpuInfo.arch}</span></b>
			</div>
			<div>
				<span>Type: </span>
				<b><span>{cpuInfo.type}</span></b>
			</div>
			<div>
				<span>Socket(s): </span>
				<b><span>{cpuInfo.sockets}</span></b>
			</div>
			<div>
				<span>Core(s): </span>
				<b><span>{cpuInfo.cores}</span></b>
			</div>
			<div>
				<span>Thread(s): </span>
				<b><span>{cpuInfo.threads}</span></b>
			</div>
			<div>
				<span>L1D: </span>
				<b><span>{cpuInfo.l1d}</span></b>
			</div>
			<div>
				<span>L1I: </span>
				<b><span>{cpuInfo.l1i}</span></b>
			</div>
			<div>
				<span>L2: </span>
				<b><span>{cpuInfo.l2}</span></b>
			</div>
			<div>
				<span>L3: </span>
				<b><span>{cpuInfo.l3}</span></b>
			</div>

		</div>

</div>
