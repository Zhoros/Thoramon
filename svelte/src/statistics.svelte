<script lang="js">
  import './style.css'
  import { onMount } from 'svelte'
  import { post, getCurrentDateTime, formatDateTime } from './helper.js'
  import Sidebar from './sidebar.svelte'
  import CustomDate from './customDate.svelte'
  import { Chart } from 'chart.js/auto'

  const id = new URLSearchParams(window.location.search).get('id')
  let statisticsCanvas

  let dataType = "cpu"
  let past = new Date()
  past.setDate(past.getDate() - 1)
  let timeFrom = getCurrentDateTime(past)
  let timeTo = getCurrentDateTime(new Date())

  let CPUChart = null
  onMount(() => {
    CPUChart = new Chart(statisticsCanvas, {
      type: 'line',
      data: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: { tension: 0.2, borderWidth: 2 },
          point: { radius: 2, hoverRadius: 5 }
        },
        scales: {
          x: {
            grid: { color: 'rgba(39, 39, 42, 0.5)' }, // zinc-800 opacity
            ticks: { color: '#a1a1aa', font: { family: 'ui-monospace, monospace', size: 11 } } // zinc-400
          },
          y: {
            grid: { color: 'rgba(39, 39, 42, 0.5)' },
            ticks: { color: '#a1a1aa', font: { size: 11 } }
          }
        },
        plugins: {
          datalabels: { display: false }, // Hiding intrusive labels for cleaner dark analytics look
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#e4e4e7', // zinc-200
              boxWidth: 12,
              usePointStyle: true,
              font: { size: 12, weight: '500' }
            }
          }
        },
      }
    })
    search()
  })

  function search() {
    post('/instanceData', {id, dataType, timeFrom: new Date(timeFrom).getTime(), timeTo: new Date(timeTo).getTime()}, (res) => {
      if (res.type == "cpu") {
        CPUChart.data.labels = []
        CPUChart.data.datasets = [
          {
            label: 'User Time %',
            data: [],
            borderColor: '#f43f5e', // modern rose-500
            backgroundColor: 'transparent'
          },
          {
            label: 'System Time %',
            data: [],
            borderColor: '#3b82f6', // modern blue-500
            backgroundColor: 'transparent'
          }
        ]
        for (let item of res.data) {
          let data = JSON.parse(item.data)
          CPUChart.data.labels.push(formatDateTime(item.time))
          CPUChart.data.datasets[0].data.push(data.userTime)
          CPUChart.data.datasets[1].data.push(data.systemTime)
        }
        CPUChart.update()
      }

      if (res.type == "memory") {
        CPUChart.data.labels = []
        CPUChart.data.datasets = [
          {
            label: 'Free (MB)',
            data: [],
            borderColor: '#10b981', // emerald-500
            backgroundColor: 'transparent'
          },
          {
            label: 'Used (MB)',
            data: [],
            borderColor: '#f43f5e',
            backgroundColor: 'transparent'
          }
        ]
        for (let item of res.data) {
          let data = JSON.parse(item.data)
          CPUChart.data.labels.push(formatDateTime(item.time))
          CPUChart.data.datasets[0].data.push((data.free/1024*1.024).toFixed(2))
          CPUChart.data.datasets[1].data.push((data.used/1024*1.024).toFixed(2))
        }
        CPUChart.update()
      }
      if (res.type == "network") {
        CPUChart.data.labels = []
        CPUChart.data.datasets = [
          {
            label: 'Upload (KB/s)',
            data: [],
            borderColor: '#a855f7', // purple-500
            backgroundColor: 'transparent'
          },
          {
            label: 'Download (KB/s)',
            data: [],
            borderColor: '#3b82f6',
            backgroundColor: 'transparent'
          }
        ]
        for (let item of res.data) {
          let data = JSON.parse(item.data)
          CPUChart.data.labels.push(formatDateTime(item.time))
          CPUChart.data.datasets[0].data.push((data.uploadSpeed*1.024).toFixed(2))
          CPUChart.data.datasets[1].data.push((data.downloadSpeed*1.024).toFixed(2))
        }
        CPUChart.update()
      }
      if (res.type == "disk") {
        CPUChart.data.labels = []
        CPUChart.data.datasets = [
          {
            label: 'Write (MB/s)',
            data: [],
            borderColor: '#eab308', // amber-500
            backgroundColor: 'transparent'
          },
          {
            label: 'Read (MB/s)',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'transparent'
          }
        ]
        for (let item of res.data) {
          let data = JSON.parse(item.data)
          CPUChart.data.labels.push(formatDateTime(item.time))
          CPUChart.data.datasets[0].data.push((data.writeSpeed/1024*1.024).toFixed(2))
          CPUChart.data.datasets[1].data.push((data.readSpeed/1024*1.024).toFixed(2))
        }
        CPUChart.update()
      }
    })
  }
</script>

<main class="w-full h-screen bg-zinc-950 text-zinc-100 flex p-6 gap-6 font-sans antialiased box-border overflow-hidden">
  
  <Sidebar/>

  <div class="flex-1 h-full overflow-y-auto flex flex-col gap-4 pr-2 custom-scrollbar">
    
    <!-- Top Mobile Header Trigger Row -->
    <div class="flex items-center mb-1 border-b border-zinc-900 pb-3">
      <button 
        popovertarget="sidebar" 
        class="text-zinc-400 hover:text-zinc-100 text-xl p-1 transition-colors bg-transparent border-none cursor-pointer"
      >
        ☰
      </button>
    </div>

    <!-- Page Title & Dashboard Toolbar Split -->
    <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-zinc-50">Metric Analytics</h1>
        <p class="text-xs text-zinc-400 mt-1">Review deep historical runtime data configurations</p>
      </div>

      <!-- Action Controller Inputs Bar -->
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Styled Select Element -->
        <select 
          bind:value={dataType} 
          on:change={search}
          class="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-600 transition-all cursor-pointer h-[38px]"
        >
          <option value="cpu">CPU Status</option>
          <option value="memory">Memory Allocation</option>
          <option value="network">Network Activity</option>
          <option value="disk">Disk I/O Speed</option>
        </select>

        <!-- Dynamic Filter Datetime Range Group -->
        <div class="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-400 h-[38px]">
          <CustomDate bind:value={timeFrom} on:change={search} type="datetime-local" class="bg-transparent border-none text-zinc-200 focus:outline-none text-xs font-mono" />
          <span class="text-zinc-600 select-none">→</span>
          <CustomDate bind:value={timeTo} on:change={search} type="datetime-local" class="bg-transparent border-none text-zinc-200 focus:outline-none text-xs font-mono" />
        </div>
      </div>
    </div>

    <!-- Main Analytics Graph Panel Section -->
    <div class="flex-1 min-h-[350px] w-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
      <div class="w-full h-full relative">
        <canvas bind:this={statisticsCanvas}></canvas>
      </div>
    </div>

  </div>
</main>
