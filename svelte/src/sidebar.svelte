<script>
  import './style.css'
  const id = new URLSearchParams(window.location.search).get('id')

  // Quick helper to check which page is currently active for active states
  const currentPath = window.location.pathname;
</script>

<!-- Popover Wrapper (For Mobile/Responsive Drawer states) -->
<div 
  id="sidebar" 
  popover 
  class="h-full p-0 m-0 border-none bg-transparent backdrop:bg-zinc-950/40 backdrop:backdrop-blur-sm"
>
  <!-- Main Sidebar Nav Body -->
  <aside 
    {...$$restProps}
    class="w-64 h-full bg-zinc-950 border-r border-zinc-900 p-4 flex flex-col gap-6 font-sans antialiased box-border"
  >
    <!-- Brand / Navigation Title -->
    <div class="px-3 py-2 flex items-center justify-between">
      <div>
        <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Navigation</div>
        <div class="text-sm font-medium text-zinc-300 mt-0.5">Host Monitor</div>
      </div>
    </div>

    <!-- Navigation Action Links -->
    <nav class="flex flex-col gap-1 flex-1">
      <button 
        on:click={() => window.location.href = '/'}
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all duration-150 text-left border-none bg-transparent cursor-pointer mb-4 border-b border-zinc-900/50 pb-4"
      >
        ← Back to Hosts
      </button>

      <button 
        on:click={() => window.location.href = `/overview.html?id=${id}`} 
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-none cursor-pointer
               {currentPath.includes('overview') ? 'bg-zinc-900 text-zinc-50 font-semibold border border-zinc-800' : 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}"
      >
        Overview
      </button>

      <button 
        on:click={() => window.location.href = `/statistics.html?id=${id}`} 
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-none cursor-pointer
               {currentPath.includes('statistics') ? 'bg-zinc-900 text-zinc-50 font-semibold border border-zinc-800' : 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}"
      >
        Statistics
      </button>

      <button 
        on:click={() => window.location.href = `/docker.html?id=${id}`} 
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left border-none cursor-pointer
               {currentPath.includes('docker') ? 'bg-zinc-900 text-zinc-50 font-semibold border border-zinc-800' : 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}"
      >
        Docker Containers
      </button>
    </nav>

    <!-- Small Footer Stamp -->
    <div class="px-3 py-2 border-t border-zinc-900/60 pt-4">
      <div class="text-[10px] font-mono text-zinc-600 tracking-tight truncate">ID: {id || 'unknown'}</div>
    </div>
  </aside>
</div>
