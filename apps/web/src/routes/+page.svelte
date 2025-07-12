<script lang="ts">
  import * as R from 'remeda'
  import type { PageProps } from './$types'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'

  function formatSlot(slot) {
    return `${slot.time}–${slot.timeEnd} (${slot.available})`
  }

  let { data }: PageProps = $props()
</script>

<div class="container p-4">
  <h1 class="mb-2 text-xl">Ledig i dag</h1>
  <div class="flex gap-3">
    {#each R.entries(data.locations) as [name, location]}
      <div class="grow rounded-md bg-gray-200 p-2">
        <h2 class="mb-2 font-bold">{name}</h2>
        {#if location.slots.length > 0}
          <div class="">
            {#each location.slots as slot}
              <div class="">{formatSlot(slot)}</div>
            {/each}
          </div>
        {:else}
          <div class="no-slots">Ingen ledige</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<div>
  <BadstuMap />
</div>
