<script lang="ts">
  import type { PageProps } from './$types'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'

  function formatSlot(slot) {
    return `${slot.time}–${slot.timeEnd} (${slot.available})`
  }

  let { data }: PageProps = $props()
</script>

<div class="container p-4">
  <h1>Ledig i dag</h1>
  <div class="flex gap-3">
    {#each data.rows as location}
      <div class="grow rounded-md bg-gray-200 p-2">
        <h2 class="mb-2 font-bold">{location.key}</h2>
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
