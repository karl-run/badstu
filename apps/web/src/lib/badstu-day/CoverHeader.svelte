<script lang="ts">
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'
  import type { AllLocationNames } from '@badstu/data/meta'
  import DiffSinceTimer from '$lib/badstu-day/DiffSinceTimer.svelte'

  const { name, lastUpdated }: { name: AllLocationNames; lastUpdated: Date | null } = $props()
</script>

<a class={['group relative h-18 shrink-0']} href="/badstu/{name.replaceAll(' ', '-')}">
  <BadstuCovers
    location={name}
    class="pointer-events-none absolute inset-0 top-0 left-0 h-full w-full rounded-t-2xl opacity-70 group-hover:opacity-100"
  />
  <h2
    class="flex h-full w-full items-center justify-center text-xl font-bold text-white drop-shadow-md drop-shadow-black"
  >
    {name}
  </h2>
  {#if lastUpdated != null}
    <div
      class="absolute right-0 bottom-2 mt-2 mr-2 flex flex-col items-center text-xs leading-3 font-bold text-white drop-shadow-md drop-shadow-black"
      title="Sist oppdatert"
    >
      <DiffSinceTimer {lastUpdated} /> min
    </div>
  {/if}
</a>
