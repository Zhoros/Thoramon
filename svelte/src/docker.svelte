<script lang="js">
  import './style.css'
  import { onMount, onDestroy } from 'svelte'
  import { post } from './helper.js'
  import Sidebar from './sidebar.svelte'

  const id = new URLSearchParams(window.location.search).get('id')

  let dockers = []
  function updateDocker() {
    post('/docker', {id}, (res) => {
      dockers = res
    })
  }

  function stopDocker(instanceId, containerId) {
    post('/stopDocker', {id: instanceId, containerId}, (res) => {
      updateDocker()
    })
  }

  function startDocker(instanceId, containerId, state) {
    post('/startDocker', {id: instanceId, containerId, state}, (res) => {
      updateDocker()
    })
  }

  updateDocker()
  
  // Set up the interval and clean it up when the component destroys
  const interval = setInterval(() => {
    updateDocker()
  }, 2000)

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

<main class="w-full h-screen bg-zinc-950 text-zinc-100 flex p-6 gap-6 font-sans antialiased box-border overflow-hidden">

  <Sidebar/>

  <div class="flex-1 h-full overflow-y-auto flex flex-col gap-4 pr-2 custom-scrollbar">
    
    <!-- Top Mobile Header Trigger Row -->
    <div class="flex items-center mb-1 border-b border-zinc-900 pb-3 md:hidden">
      <button 
        popovertarget="sidebar" 
        class="text-zinc-400 hover:text-zinc-100 text-xl p-1 transition-colors bg-transparent border-none cursor-pointer"
      >
        ☰
      </button>
    </div>

    <!-- Page Header Section -->
    <div class="w-full border-b border-zinc-900 pb-4">
      <h1 class="text-xl font-semibold tracking-tight text-zinc-50">Docker Containers</h1>
      <p class="text-xs text-zinc-400 mt-1">Manage and orchestrate virtualized node deployments</p>
    </div>

    <!-- Container Grid List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      {#each dockers as d}
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-md hover:border-zinc-700 transition-colors duration-150">
          
          <!-- Top Info Row -->
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <h2 class="text-lg font-medium text-zinc-100 truncate" title={d.name}>{d.name}</h2>
              
              <!-- Clean State Badge Indicator -->
              {#if d.state === 'running'}
                <span class="px-2 py-0.5 text-[11px] font-medium bg-emerald-950/50 border border-emerald-800 text-emerald-400 rounded-full">
                  {d.state}
                </span>
              {:else}
                <span class="px-2 py-0.5 text-[11px] font-medium bg-zinc-950/50 border border-zinc-800 text-zinc-400 rounded-full">
                  {d.state}
                </span>
              {/if}
            </div>

            <!-- Meta Parameters Stack -->
            <div class="flex flex-col gap-1.5 text-xs">
              <div class="flex justify-between border-b border-zinc-800/40 pb-1.5">
                <span class="text-zinc-500">Status</span>
                <span class="text-zinc-300 font-medium truncate max-w-[200px]">{d.status}</span>
              </div>
              <div class="flex justify-between items-center pt-0.5">
                <span class="text-zinc-500">Container ID</span>
                <span class="text-zinc-400 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800/60 text-[11px]">
                  {d.containerId.substring(0, 12)}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Operational Actions Toolbar -->
          <div class="flex gap-2 mt-6 pt-3 border-t border-zinc-800/60">
            <button 
              disabled={d.state !== 'running'}
              on:click={() => stopDocker(d.id, d.containerId)} 
              class="flex-1 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Stop
            </button>
            
            <button 
              on:click={() => startDocker(d.id, d.containerId, d.status)}
              class="flex-1 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700/50 transition-colors duration-150"
            >
              {d.state == "exited" ? "Start" : "Restart"}
            </button>
          </div>

        </div>
      {/each}
    </div>

  </div>
</main>
