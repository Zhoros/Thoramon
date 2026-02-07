<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post, getCurrentDateTime, formatDateTime } from './helper.js'
	import Sidebar from './sidebar.svelte'
	import CustomDate from './CustomDate.svelte'
	import { Chart } from 'chart.js/auto'

	const id = new URLSearchParams(window.location.search).get('id')
	let statisticsCanvas

	let dataType = "cpu"
	let past = new Date()
	past.setDate(past.getDate() - 1)
	let timeFrom = getCurrentDateTime(past)
	let timeTo = getCurrentDateTime(new Date())

	let CPUChart = null
	onMount(() => {

		CPUChart = new Chart(statisticsCanvas, {
			type: 'line',
			data: {},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 14
                }
            },
            legend: {
                position: 'bottom'
            }
        },
			}
		})
		search()
	})

	function search() {
		post('/instanceData', {id, dataType, timeFrom: new Date(timeFrom).getTime(), timeTo: new Date(timeTo).getTime()}, (res) => {
			if (res.type == "cpu") {
				CPUChart.data.labels = []
				CPUChart.data.datasets = 
				[
					{
						label: 'user time %',
						data: [],
						borderColor: 'rgb(255, 99, 132)'
					},
					{
						label: 'system time %',
						data: [],
						borderColor: 'rgb(54, 162, 235)',
					}
				]
				for (let item of res.data) {
					let data = JSON.parse(item.data)
					CPUChart.data.labels.push(formatDateTime(item.time))
					CPUChart.data.datasets[0].data.push(data.userTime)
					CPUChart.data.datasets[1].data.push(data.systemTime)
					CPUChart.update()
				}
			}

			if (res.type == "memory") {
				CPUChart.data.labels = []
				CPUChart.data.datasets = 
				[
					{
						label: 'free (MB)',
						data: [],
						borderColor: 'rgb(54, 162, 235)',
					},
					{
						label: 'used (MB)',
						data: [],
						borderColor: 'rgb(255, 99, 132)'
					}
				]
				for (let item of res.data) {
					let data = JSON.parse(item.data)
					CPUChart.data.labels.push(formatDateTime(item.time))
					CPUChart.data.datasets[0].data.push((data.free/1024*1.024).toFixed(2))
					CPUChart.data.datasets[1].data.push((data.used/1024*1.024).toFixed(2))
					CPUChart.update()
				}
			}
			if (res.type == "network") {
				CPUChart.data.labels = []
				CPUChart.data.datasets = 
				[
					{
						label: 'upload (KB/s)',
						data: [],
						borderColor: 'rgb(255, 99, 132)'
					},
					{
						label: 'download (KB/s)',
						data: [],
						borderColor: 'rgb(54, 162, 235)',
					}
				]
				for (let item of res.data) {
					let data = JSON.parse(item.data)
					console.log(data)
					CPUChart.data.labels.push(formatDateTime(item.time))
					CPUChart.data.datasets[0].data.push((data.uploadSpeed*1.024).toFixed(2))
					CPUChart.data.datasets[1].data.push((data.downloadSpeed*1.024).toFixed(2))
					CPUChart.update()
				}
			}
			if (res.type == "disk") {
				CPUChart.data.labels = []
				CPUChart.data.datasets = 
				[
					{
						label: 'write (MB/s)',
						data: [],
						borderColor: 'rgb(255, 99, 132)'
					},
					{
						label: 'read (MB/s)',
						data: [],
						borderColor: 'rgb(54, 162, 235)',
					}
				]
				for (let item of res.data) {
					let data = JSON.parse(item.data)
					console.log(data)
					CPUChart.data.labels.push(formatDateTime(item.time))
					CPUChart.data.datasets[0].data.push((data.writeSpeed/1024*1.024).toFixed(2))
					CPUChart.data.datasets[1].data.push((data.readSpeed/1024*1.024).toFixed(2))
					CPUChart.update()
				}
			}

		})
	}

</script>

<main style="width: 100%; height: 100%; box-sizing: border-box; display: flex; gap: 10px;">

	<Sidebar/>
	<div class="panel" style="display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: scroll;">

		<div>
			<button popovertarget="sidebar" style="background-color: rgb(0,0,0,0); font-size: 2rem; padding: 0;">☰</button>
		</div>

		<div style="height: 10px"></div>
		<div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
			<h2>Statistics</h2>
			<select bind:value={dataType} on:change={search}>
				<option value="cpu">CPU</option>
				<option value="memory">Memory</option>
				<option value="network">Network</option>
				<option value="disk">Disk</option>
			</select>

			<div style="width: 100%; display: flex; align-items: center; gap: 10px">
				<CustomDate bind:value={timeFrom} on:change={search} style="flex: 1" type="datetime-local"/>
				<span>→</span>
				<CustomDate bind:value={timeTo} on:change={search} style="flex: 1" type="datetime-local"/>
			</div>

			<div style="flex: 1">
				<canvas style="width: 100%; height: 100%;" bind:this={statisticsCanvas}></canvas>
			</div>
		</div>
	</div>

</main>
