<script lang="ts">
  import { Bomb } from '@lucide/svelte'

  import { page } from '$app/state'
</script>

<div class="container mx-auto p-4">
  <div class="flex grow flex-col flex-wrap items-center justify-center gap-4 rounded-xl p-8">
    <div class="flex gap-3">
      <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
      <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
      <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
    </div>
    <div>Kunne ikke laste inn bookinger for {page.data.name ?? 'denne badstuen'} :(</div>
    <pre class="rounded-md bg-white p-1 px-2 text-black">{page.error?.message ?? 'Unknown error'}</pre>
    <div>Prøv igjen senere!</div>
  </div>
</div>
