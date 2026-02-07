<script lang="js">

	import './style.css'
	import Dialog from './dialog.svelte'
	import { post, uuid } from './helper.js'

	let isEdit = false
	let showAddHostDialog = false
	let label = ""
	let host = ""
	let user = ""
	let password = ""
	let privkey = ""

	function addHost() {
		post('/addHost', {id: uuid(), label, host, user, password, privkey}, (res) => {
			showAddHostDialog = false
			label = ""
			host = ""
			user = ""
			password = ""
			privkey = ""
			fetchHosts()
		})
	}

	function addClicked() {
		showAddHostDialog=true;
		isEdit = false
		label = ""
		host = ""
		user = ""
		password = ""
		privkey = ""
	}

	function editHost() {
		post('/editHost', {id: editId, label, host, user, password, privkey}, (res) => {
			showAddHostDialog = false
			label = ""
			host = ""
			user = ""
			password = ""
			privkey = ""
			fetchHosts()
		})
	}

	let editId
	function editClicked(old) {
		isEdit = true
		editId = old.id
		label = old.label
		host = old.host
		user = old.user
		password = old.password
		privkey = old.privkey
		showAddHostDialog = true
	}

	let showDeleteConfirmDialog = false
	let deleteId
	let deleteLabel
	function deleteHost(id) {
		post('/deleteHost', {id: deleteId}, (res) => {
			fetchHosts()
			showDeleteConfirmDialog = false
		})
	}

	let hosts = []
	function fetchHosts() {
		post('/getHosts', {}, (res) => {
			hosts = res
		})
	}
	fetchHosts()

</script>

<style>
.card {
	width: 300px;
	height: 170px;
}
@media screen and (max-width: 600px) {
  .card {
    width: 100%;
  }
}
</style>

<main style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 10px; box-sizing: border-box; gap: 15px">
	<div style="width: 100%; display: flex; justify-content: flex-end">
		<button on:click={addClicked}> + New Host</button>
	</div>

	<div style="width: 100%; display: flex; justify-content: start; flex-wrap: wrap; gap: 10px;">
		{#each hosts as h}
			<div class="panel card" style="display: flex; flex-direction: column; align-items: flex-start; border-radius: 25px">
				<h2>{h.label}</h2>
				<span>IP/Domain: {h.host}</span>
				<div style="height: 20px; width: 1px;"></div>
				<div style="width: 100%; display: flex; justify-content: flex-end; gap: 10px;">
					<button on:click={()=>{showDeleteConfirmDialog=true; deleteId=h.id; deleteLabel=h.label}} class="danger">Delete</button>
					<button on:click={()=>{editClicked(h)}}>Edit</button>
					<button on:click={()=>{window.open(`/overview.html?id=${encodeURI(h.id)}`)}}>Open</button>
				</div>
			</div>
		{/each}
	</div>

	<Dialog width="400px" bind:show={showAddHostDialog} title={isEdit ? "Edit Host" : "Add New Host"}>
		<div style="display: flex; flex-direction: column; gap: 15px;">
			<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
				<span>Label:</span>
				<input bind:value={label}>
			</div>
			<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
				<span>IP / Domain:</span>
				<input bind:value={host}>
			</div>
			<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
				<span>User:</span>
				<input bind:value={user}>
			</div>
			<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
				<span>Password:</span>
				<input bind:value={password}>
			</div>
			<div style="display: flex; flex-direction: column; align-items: start; gap: 10px">
				<span>Public key:</span>
				<textarea bind:value={privkey} style="height: 75px"></textarea>
			</div>
			<button disabled={!((label && host && user) && (password || privkey))} on:click={isEdit ? editHost() : addHost()}>{isEdit ? "Save Edit" : "Add host"}</button>
		</div>
	</Dialog>

	<Dialog bind:show={showDeleteConfirmDialog} title={"Confirm"} style="height: 1000px">
		<span>Stop monitoring {deleteLabel} and delete all existing logs? This action cannot be undone</span>
		<button on:click={deleteHost}>Yes</button>
		<button on:click={()=>{showDeleteConfirmDialog=false}} class="passive">Cancel</button>
	</Dialog>

</main>
