<script lang="ts">
  import '../app.css'
  import { ArrowLeft } from '@lucide/svelte'
  import logo from '$lib/assets/logo.png'

  import { page } from '$app/state'

  let { children } = $props()
</script>

<header class="flex h-16 items-center justify-between border-b border-b-gray-300 bg-gray-100">
  <a href="/" class="group flex items-center gap-4">
    <img src={logo} alt="" height={32} width={32} class="ml-4 h-10 w-10 shrink-0" />
    <h1 class="flex items-center gap-1 text-2xl text-gray-800">
      <ArrowLeft class={['transition-all group-hover:-translate-x-1', page.url.pathname === '/' && 'w-0']} />
      <span>Badstu i Oslo</span>
    </h1>
  </a>
</header>

{@render children()}
