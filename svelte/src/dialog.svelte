<script>
	export let title
	export let show = false
	export let width
</script>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.3); /* Dim the background */
		backdrop-filter: blur(8px);           /* The blur effect */
	}
</style>

{#if show}
<div class="backdrop" style="display: flex; justify-content: center; align-items: center">
	<div style="width: {width}; max-width: calc(100% - 30px); position: absolute; background-color: rgb(0, 0, 0, 0); border: none;">
		<div style="background-color: var(--title); border: none; border-radius: 25px 25px 0px 0px; color: white; display: flex; justify-content: space-between; align-items; center; padding: 5px 20px 5px 20px">
			<div></div>
			<div style="display: flex; align-items: center;">{title}</div>
			<button on:click={()=>{show = false}} class="plain">✕</button>
		</div>
		<div style="max-height: calc(100% - 30px);background-color: var(--panel); border: none; border-radius: 0px 0px 25px 25px; color: white; padding: 20px; display: flex; flex-direction: column; gap: 10px;">
			<slot/>
		</div>
	</div>
</div>
{/if}
