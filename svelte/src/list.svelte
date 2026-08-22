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
      resetForm()
      fetchHosts()
    })
  }

  function addClicked() {
    isEdit = false
    resetForm()
    showAddHostDialog = true
  }

  function editHost() {
    post('/editHost', {id: editId, label, host, user, password, privkey}, (res) => {
      showAddHostDialog = false
      resetForm()
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

  function resetForm() {
    label = ""
    host = ""
    user = ""
    password = ""
    privkey = ""
  }

  let showDeleteConfirmDialog = false
  let deleteId
  let deleteLabel
  
  function openDeleteConfirm(h) {
    deleteId = h.id
    deleteLabel = h.label
    showDeleteConfirmDialog = true
  }

  function deleteHost() {
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

<main class="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6 flex flex-col gap-6 font-sans antialiased">
  <!-- Header / Action Bar -->
  <div class="w-full flex justify-between items-center border-b border-zinc-800 pb-4">
    <div>
      <h1 class="text-xl font-semibold tracking-tight text-zinc-50">Infrastructure Hosts</h1>
      <p class="text-xs text-zinc-400 mt-1">Manage and monitor connected environments</p>
    </div>
    <button 
      on:click={addClicked} 
      class="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-medium rounded-lg transition-colors duration-150 shadow-sm"
    >
      + New Host
    </button>
  </div>

  <!-- Host Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
    {#each hosts as h}
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors duration-150 shadow-md">
        <div>
          <h2 class="text-lg font-medium text-zinc-100 truncate mb-1">{h.label}</h2>
          <span class="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800/50 inline-block truncate max-w-full">
            {h.host}
          </span>
        </div>
        
        <div class="flex justify-end gap-2 mt-6 pt-3 border-t border-zinc-800/60">
          <button 
            on:click={() => openDeleteConfirm(h)} 
            class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-md transition-colors duration-150"
          >
            Delete
          </button>
          <button 
            on:click={() => editClicked(h)} 
            class="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors duration-150"
          >
            Edit
          </button>
          <button 
            on:click={() => window.open(`/overview.html?id=${encodeURI(h.id)}`)} 
            class="px-3 py-1.5 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors duration-150"
          >
            Open
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Add/Edit Dialog -->
  <Dialog width="440px" bind:show={showAddHostDialog} title={isEdit ? "Edit Host" : "Add New Host"}>
    <!-- Added border, padding, and rounding wrapper for the dialog outline -->
    <div class="flex flex-col gap-4">
      <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
        <span>Label</span>
        <input 
          bind:value={label} 
          placeholder="e.g., Production Web"
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder-zinc-600 transition-all"
        />
      </label>

      <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
        <span>IP / Domain</span>
        <input 
          bind:value={host} 
          placeholder="192.168.1.1 or example.com"
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm font-mono focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder-zinc-600 transition-all"
        />
      </label>

      <div class="grid grid-cols-2 gap-3">
        <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
          <span>User</span>
          <input 
            bind:value={user} 
            placeholder="root"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder-zinc-600 transition-all"
          />
        </label>

        <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
          <span>Password</span>
          <input 
            type="password"
            bind:value={password} 
            placeholder="••••••••"
            class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder-zinc-600 transition-all"
          />
        </label>
      </div>

      <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-300">
        <span>Public key</span>
        <textarea 
          bind:value={privkey} 
          placeholder="-----BEGIN OPENSSH PUBLIC KEY-----"
          class="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-xs font-mono resize-none focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 placeholder-zinc-700 transition-all"
        ></textarea>
      </label>

      <button 
        disabled={!((label && host && user) && (password || privkey))} 
        on:click={isEdit ? editHost : addHost}
        class="w-full mt-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 shadow-sm
               disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed
               enabled:bg-zinc-100 enabled:text-zinc-900 enabled:hover:bg-zinc-200"
      >
        {isEdit ? "Save Changes" : "Add Host Environment"}
      </button>
    </div>
  </Dialog>

  <!-- Delete Confirmation Dialog -->
  <Dialog bind:show={showDeleteConfirmDialog} title="Confirm Deletion">
    <!-- Added border, padding, and rounding wrapper for the dialog outline -->
    <div class="flex flex-col gap-5 p-5 ">
      <p class="text-sm leading-relaxed text-zinc-400">
        Are you sure you want to stop monitoring <strong class="text-zinc-200 font-semibold">{deleteLabel}</strong> and completely purge all historical metric data? This process cannot be reversed.
      </p>
      
      <div class="flex justify-end gap-3 border-t border-zinc-800/60 pt-4">
        <button 
          on:click={() => showDeleteConfirmDialog = false} 
          class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          on:click={deleteHost} 
          class="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-sm"
        >
          Permanently Delete
        </button>
      </div>
    </div>
  </Dialog>
</main>
