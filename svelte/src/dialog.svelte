<script>
	import './style.css'
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
		background-color: rgba(0, 0, 0, 0.4); /* Slightly darker for better contrast */
		backdrop-filter: blur(8px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 50; /* Ensure it stays on top */
	}
</style>

{#if show}
<div class="backdrop">
	<div 
		class="border border-zinc-800 rounded-xl bg-zinc-900 text-zinc-200 shadow-2xl flex flex-col overflow-hidden"  
		style="width: {width}; max-width: calc(100% - 30px);"
	>
		<div class="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
			<span class="text-sm font-medium text-zinc-100">{title}</span>
			<button 
				on:click={() => { show = false }} 
				class="text-zinc-400 hover:text-zinc-100 transition-colors text-xs p-1"
			>
				✕
			</button>
		</div>
		
		<div class="p-4 max-h-[85vh] overflow-y-auto">
			<slot/>
		</div>
	</div>
</div>
{/if}
