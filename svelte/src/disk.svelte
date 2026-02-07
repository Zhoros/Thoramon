<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post } from './helper.js'

	const id = new URLSearchParams(window.location.search).get('id')

	let diskInfo = {}
	onMount(() => {
		
		function updateDisk() {
			post('/disk', {id}, (res) => {
				diskInfo = res
			})
		}

		updateDisk()
		setInterval(() => {
			updateDisk()
		}, 2000)

	})

</script>

<div style="width: 325px; display: flex; gap: 10px; flex-wrap: wrap;">
	<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: center; background-color: var(--bg); border-radius: 20px; padding: 10px;">
		<h4>Read</h4>
		<h5>{(diskInfo.readSpeed/1024*1.024).toFixed(2)} MB/s</h5>
	</div>
	<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; align-items: center; background-color: var(--bg); border-radius: 20px; padding: 10px;">
		<h4>Write</h4>
		<h5>{(diskInfo.writeSpeed/1024*1.024).toFixed(2)} MB/s</h5>
	</div>
</div>
