<script lang="ts">
  import * as R from 'remeda'
  import { onDestroy } from 'svelte'
  import { LocateFixed } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { mapStore } from '$lib/badstu-map/map-store'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'
  import { type Map } from 'svelte-maplibre'
  import { allBadstuLocations } from '@badstu/data/meta'

  function formatSlot(slot: any) {
    return `${slot.time}–${slot.timeEnd} (${slot.available})`
  }

  let map: Map | null = null
  const unsubscribe = mapStore.subscribe((m) => {
    map = m
  })

  onDestroy(unsubscribe)

  let { data }: PageProps = $props()
</script>

<div class="container p-4">
  <h1 class="mb-2 text-xl">Ledig i dag</h1>
  <div class="flex gap-3">
    {#each R.entries(data.locations) as [name, location]}
      <div class="relative grow rounded-md bg-gray-200 p-2">
        <div class="mb-1 flex items-center gap-2">
          <button
            class="cursor-pointer hover:shadow-2xl"
            onclick={() => {
              const location = allBadstuLocations[name]
              if (!location || !location.loc) {
                console.error(`No location found for ${name}`)
                return
              }

              return map?.flyTo({ center: location.loc, zoom: 15 })
            }}
          >
            <LocateFixed aria-label="zoom to location" class="h-4 w-4" />
          </button>
          <h2 class="font-bold">{name}</h2>
        </div>
        {#if location.slots.length > 0}
          <div class="">
            {#each location.slots as slot}
              <div>
                <div class="">{formatSlot(slot)}</div>
                {#if 'variation' in slot && location.variations > 1}
                  <div class="-mt-1.5 ml-2 text-xs">{slot.variation}</div>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="no-slots">Ingen ledige</div>
        {/if}
        <a class="absolute right-2 bottom-1" href="/badstu/{name.replaceAll(' ', '-')}">Senere</a>
      </div>
    {/each}
  </div>
</div>

<div>
  <BadstuMap />
</div>
