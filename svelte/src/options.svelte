<script lang="js">
  import './style.css'
  import { onMount, onDestroy } from 'svelte'
  import { post } from './helper.js'
  import Sidebar from './sidebar.svelte'

  const id = new URLSearchParams(window.location.search).get('id')

  let deleteMonths = 0
  let deleteDays = 0

  let frequencyHours = 0
  let frequencyMinutes = 0
  let frequencySeconds = 0

  function save() {
    const hoursToMs = frequencyHours * 60 * 60 * 1000
    const minutesToMs = frequencyMinutes * 60 * 1000
    const secondsToMs = frequencySeconds * 1000
    const monitorFrequencyMs = hoursToMs + minutesToMs + secondsToMs

    const totalDays = (deleteMonths * 30) + deleteDays
    const dataExpiryMs = totalDays * 24 * 60 * 60 * 1000

    post('/updateOptions', {
      id,
      monitorFrequency: monitorFrequencyMs,
      dataExpiry: dataExpiryMs
    }, (res) => {
      console.log('Options updated successfully:', res)
    })
  }

  post('/options', {id}, (res) => {
    let totalSeconds = Math.floor(res.monitorFrequency / 1000)
    frequencyHours = Math.floor(totalSeconds / 3600)
    frequencyMinutes = Math.floor((totalSeconds % 3600) / 60)
    frequencySeconds = totalSeconds % 60

    let totalDays = Math.floor(res.dataExpiry / 86400000) 
    deleteMonths = Math.floor(totalDays / 30)
    deleteDays = totalDays % 30

  })
</script>

<main class="w-full h-screen bg-zinc-950 text-zinc-100 flex p-6 gap-6 font-sans antialiased box-border overflow-hidden">

  <Sidebar/>

  <div class="flex-1 h-full overflow-y-auto flex flex-col gap-4 pr-2 custom-scrollbar">
    
    <div class="flex items-center mb-1 border-b border-zinc-900 pb-3">
      <button 
        popovertarget="sidebar" 
        class="text-zinc-400 hover:text-zinc-100 text-xl p-1 transition-colors bg-transparent border-none cursor-pointer"
      >
        ☰
      </button>
    </div>

    <div class="w-full border-b border-zinc-900 pb-4">
      <h1 class="text-xl font-semibold tracking-tight text-zinc-50">Options</h1>
    </div>

    <div class="flex flex-col gap-6 max-w-2xl mt-2">
      
      <div class="bg-zinc-900/50 border border-zinc-900 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-sm font-medium text-zinc-200">Auto delete monitor data after</h2>
          <p class="text-xs text-zinc-500 mt-0.5">Specify the retention period before historical metrics are permanently removed.</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="delete-months" class="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">Months</label>
            <input 
              type="number" 
              id="delete-months"
              min="0"
              bind:value={deleteMonths}
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
              placeholder="0"
            />
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label for="delete-days" class="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">Days</label>
            <input 
              type="number" 
              id="delete-days"
              min="0"
              max="31"
              bind:value={deleteDays}
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div class="bg-zinc-900/50 border border-zinc-900 rounded-xl p-5 flex flex-col gap-4">
        <div>
          <h2 class="text-sm font-medium text-zinc-200">Monitor frequency</h2>
          <p class="text-xs text-zinc-500 mt-0.5">Set how often the agent scrapes and records resource metrics.</p>
        </div>
        
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="freq-hours" class="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">Hours</label>
            <input 
              type="number" 
              id="freq-hours"
              min="0"
              bind:value={frequencyHours}
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
              placeholder="0"
            />
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label for="freq-minutes" class="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">Minutes</label>
            <input 
              type="number" 
              id="freq-minutes"
              min="0"
              max="59"
              bind:value={frequencyMinutes}
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
              placeholder="0"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="freq-seconds" class="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">Seconds</label>
            <input 
              type="number" 
              id="freq-seconds"
              min="0"
              max="59"
              bind:value={frequencySeconds}
              class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 transition-colors"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-2">
        <button 
          on:click={save}
          type="button"
          class="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Save Changes
        </button>
      </div>

    </div>
  </div>
</main>
