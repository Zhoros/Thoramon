<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post } from './helper.js'
	import { Chart } from 'chart.js/auto'
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	import Sidebar from './sidebar.svelte'

	Chart.register(ChartDataLabels);
	const id = new URLSearchParams(window.location.search).get('id')

	let memoryCanvas
	let memoryInfo = {}
	onMount(() => {

		let memoryChart = new Chart(memoryCanvas, {
			type: 'bar',
			data: {
				labels: ['Memory', 'Swap'],
				datasets: [
					{
						label: 'Used',
						data: [1, 1],
						backgroundColor: '#ff6384',
					},
					{
						label: 'Free',
						data: [2, 2],
						backgroundColor: '#36a2eb',
					},
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { stacked: true },
					y: { stacked: true }
				},
				plugins: {
					datalabels: {
						color: '#fff',
						formatter: (val) => val > 0 ? val.toFixed(1) + '%' : '' 
					}
				}
			}
		})
		
		function updateMemory() {
			post('/memory', {id}, (res) => {
				memoryInfo = res
				let memTotal = res.used + res.free
				let swapTotal = res.swapUsed + res.swapFree
				memoryChart.data.datasets[0].data = [res.used/memTotal*100, res.swapUsed/swapTotal*100]
				memoryChart.data.datasets[1].data = [res.free/memTotal*100, res.swapFree/swapTotal*100]
				memoryChart.update()
			})
		}

		updateMemory()
		setInterval(() => {
			updateMemory()
		}, 2000)

	})

</script>

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
	<div style="width: 250px; height: 250px">
		<canvas bind:this={memoryCanvas}></canvas>
	</div>
	<div style="display: flex; flex-direction: column">
			<span>Used: {(memoryInfo.used/1024*1.024).toFixed(1)} MB</span>
			<span>Free: {(memoryInfo.free/1024*1.024).toFixed(1)} MB</span>
			<span>Swap used: {(memoryInfo.swapUsed/1024*1.024).toFixed(1)} MB</span>
			<span>Swap free: {(memoryInfo.swapFree/1024*1.024).toFixed(1)} MB</span>
	</div>
</div>
