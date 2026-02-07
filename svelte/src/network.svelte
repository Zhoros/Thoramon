<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post } from './helper.js'
	import Sidebar from './sidebar.svelte'

	const id = new URLSearchParams(window.location.search).get('id')

	let networkInfo = {}
	onMount(() => {
		
		function updateNetwork() {
			post('/network', {id}, (res) => {
				networkInfo = res
			})
		}

		updateNetwork()
		setInterval(() => {
			updateNetwork()
		}, 2000)

	})

</script>

<div style="width: 325px; display: flex; gap: 10px; flex-wrap: wrap;">
	<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: center; background-color: var(--bg); border-radius: 20px; padding: 10px;">
		<h4>Upload ⬆</h4>
		<h5>{(networkInfo.uploadSpeed*1.024).toFixed(2)} KB/s</h5>
	</div>
	<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: center; background-color: var(--bg); border-radius: 20px; padding: 10px;">
		<h4>Download ⬇</h4>
		<h5>{(networkInfo.downloadSpeed*1.024).toFixed(2)} KB/s</h5>
	</div>
</div>
