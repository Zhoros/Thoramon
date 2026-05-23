<script lang="js">
  import './style.css'
  import { post } from './helper.js'
  import Sidebar from './sidebar.svelte'
  import Cpu from './cpu.svelte'
  import Memory from './memory.svelte'
  import Network from './network.svelte'
  import Disk from './disk.svelte'
</script>

<main class="w-full h-screen bg-zinc-950 text-zinc-100 flex p-6 gap-6 font-sans antialiased box-border overflow-hidden">
  
  <!-- Sidebar Navigation Component -->
  <Sidebar/>

  <!-- Main Dashboard Content Panel -->
  <div class="flex-1 h-full overflow-y-auto pr-2 custom-scrollbar">
    
    <!-- Top Mobile-Friendly Action Row -->
    <div class="flex items-center mb-4 border-b border-zinc-900 pb-3">
      <button 
        popovertarget="sidebar" 
        class="text-zinc-400 hover:text-zinc-100 text-xl p-1 transition-colors bg-transparent border-none cursor-pointer"
      >
        ☰
      </button>
    </div>

    <!-- Responsive Resource Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      
      <!-- CPU Block -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-md hover:border-zinc-700 transition-colors duration-150">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">CPU</h2>
        <Cpu/>
      </div>

      <!-- Memory Block -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-md hover:border-zinc-700 transition-colors duration-150">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Memory</h2>
        <Memory/>
      </div>

      <!-- Network Block -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-md hover:border-zinc-700 transition-colors duration-150">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Network</h2>
        <Network/>
      </div>

      <!-- Disk Block -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 shadow-md hover:border-zinc-700 transition-colors duration-150">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-400">Disk</h2>
        <Disk/>
      </div>

    </div>
  </div>

</main>
