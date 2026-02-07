<script>
	const id = new URLSearchParams(window.location.search).get('id')
</script>

<div id="sidebar" popover style="padding: 0; margin: 0; border: none; height: 100%; background-color: rgb(0,0,0,0)">
	<div class="panel" style="width: 200px; height: 100%; display: flex; flex-direction: column; background-color: var(--bg)" {...$$restProps}>
		<button on:click={()=>{window.close()}} class="plain" style="font-size: 2rem">Back</button>
		<button on:click={()=>{window.location.href=`/overview.html?id=${id}`}} class="plain" style="font-size: 2rem">Overview</button>
		<button on:click={()=>{window.location.href=`/statistics.html?id=${id}`}} class="plain" style="font-size: 2rem">Statistics</button>
		<button on:click={()=>{window.location.href=`/docker.html?id=${id}`}} class="plain" style="font-size: 2rem">Docker</button>
	</div>
</div>
