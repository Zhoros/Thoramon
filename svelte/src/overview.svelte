<script lang="js">

	import './style.css'
	import { post } from './helper.js'
	import Sidebar from './sidebar.svelte'
	import Cpu from './cpu.svelte'
	import Memory from './memory.svelte'
	import Network from './network.svelte'
	import Disk from './disk.svelte'

</script>

<main style="width: 100%; height: 100%; box-sizing: border-box; display: flex; gap: 10px;">

	<Sidebar/>
	<div class="panel" style="width: 100%; height: 100%; overflow-y: scroll">

		<button popovertarget="sidebar" style="background-color: rgb(0,0,0,0); font-size: 2rem; padding: 0">☰</button>
		<div style="height: 10px"></div>
		<div style="display: flex; flex-wrap: wrap; gap: 35px;">
			<div style="display: flex; flex-direction: column">
				<h2>CPU</h2>
				<Cpu/>
			</div>

			<div style="display: flex; flex-direction: column">
				<h2>Memory</h2>
				<Memory/>
			</div>

			<div style="display: flex; flex-direction: column; gap: 10px">
				<h2>Network</h2>
				<Network/>
			</div>

			<div style="display: flex; flex-direction: column; gap: 10px">
				<h2>Disk</h2>
				<Disk/>
			</div>
		</div>
	</div>

</main>
