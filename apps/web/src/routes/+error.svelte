<script lang="ts">
  import { Bomb } from '@lucide/svelte'
  import OtherDayPicker from '$lib/other-day-picker/OtherDayPicker.svelte'

  import { page } from '$app/state'
</script>

<div class="grid h-[calc(100svh-4rem)] grid-cols-1 grid-rows-[calc(70svh-4rem)_30svh]">
  <div class="flex flex-col">
    <div class="flex">
      <h2 class="shrink-0 p-4 text-xl">Badstuer i dag</h2>
      <OtherDayPicker />
    </div>
    <div class="mt-2 flex h-full max-w-screen gap-3 overflow-auto px-3 pb-3 md:h-auto md:min-h-96">
      <div class="flex grow flex-col flex-wrap items-center justify-center gap-4 rounded-xl p-8">
        <div class="flex gap-3">
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
        </div>
        <div>Kunne ikke laste badstutidene!!</div>
        <pre class="rounded-md bg-white p-1 px-2 text-black">{page.error?.message ?? 'Unknown error'}</pre>
        <div>Prøv igjen senere :)</div>
      </div>
    </div>
  </div>
</div>
