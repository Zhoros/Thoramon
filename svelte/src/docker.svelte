<script lang="js">

	import './style.css'
	import { onMount } from 'svelte'
	import { post } from './helper.js'
	import Sidebar from './sidebar.svelte'

	const id = new URLSearchParams(window.location.search).get('id')

	let dockers = []
	function updateDocker() {
		post('/docker', {id}, (res) => {
			dockers = res
		})
	}

	function stopDocker(id, containerId) {
		post('/stopDocker', {id, containerId}, (res) => {
			updateDocker()
		})
	}

	function startDocker(id, containerId, state) {
		post('/startDocker', {id, containerId, state}, (res) => {
			updateDocker()
		})
	}

	updateDocker()
	setInterval(()=>{
		updateDocker()
	}, 2000) 

</script>

<main style="width: 100%; height: 100%; box-sizing: border-box; display: flex; gap: 10px;">

	<Sidebar/>
	<div class="panel" style="width: 100%; height: 100%; overflow-y: scroll">

		<button popovertarget="sidebar" style="background-color: rgb(0,0,0,0); font-size: 2rem; padding: 0">☰</button>

		<div style="height: 10px"></div>
		<div style="width: 100%; display: flex; justify-content: start; flex-wrap: wrap; gap: 10px;">
			{#each dockers as d}
				<div class="panel" style="display: flex; flex-direction: column; align-items: flex-start; border-radius: 25px; background-color: var(--bg)">
					<h2>{d.name}</h2>
					<h3>State: {d.state}</h3>
					<h3>Status: {d.status}</h3>
					<h3>ID: {d.containerId}</h3>

					<div style="height: 10px"></div>
					<div>
						<button on:click={()=>{stopDocker(d.id, d.containerId)}} class="danger">Stop</button>
						<button on:click={()=>{startDocker(d.id, d.containerId, d.status)}}>{d.state == "exited" ? "Start" : "Restart"}</button>
					</div>
				</div>
			{/each}
		</div>

	</div>

</main>
