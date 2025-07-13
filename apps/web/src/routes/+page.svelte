<script lang="ts">
  import * as R from 'remeda'
  import { onDestroy } from 'svelte'
  import { LocateFixed } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { mapStore } from '$lib/badstu-map/map-store'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'
  import { type Map } from 'svelte-maplibre'
  import { allBadstuLocations } from '@badstu/data/meta'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'

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
  <div class="flex gap-3 overflow-hidden">
    {#each R.entries(data.locations) as [name, location]}
      <div class="relative w-[calc(100vw-100px)] grow overflow-hidden rounded-2xl bg-gray-200 md:w-64 md:grow">
        <div class="relative z-10 mb-1 h-18 bg-black">
          <div class="z-10 flex h-full w-full items-center gap-1 text-white">
            <button
              class="m-2 cursor-pointer rounded-full p-2 hover:shadow-2xl hover:outline-1"
              onclick={() => {
                const location = allBadstuLocations[name]
                if (!location || !location.loc) {
                  console.error(`No location found for ${name}`)
                  return
                }

                return map?.flyTo({ center: location.loc, zoom: 15 })
              }}
            >
              <LocateFixed aria-label="zoom to location" class="h-6 w-6" />
            </button>
            <h2 class="text-xl font-bold drop-shadow-md drop-shadow-black">{name}</h2>
          </div>
          <BadstuCovers
            location={name}
            class="pointer-events-none absolute inset-0 top-0 left-0 -z-1 h-full w-full opacity-70"
          />
        </div>
        <div>
          {#if location.slots.length > 0}
            <div class="divide-y divide-gray-400">
              {#each location.slots as slot}
                <div class="flex h-12 flex-col justify-center p-2 hover:bg-gray-400">
                  {#if 'variation' in slot && location.variations > 1}
                    <div class="text-xs">{slot.variation}</div>
                  {:else if location.variation}
                    <div class="text-xs">{location.variation}</div>
                  {/if}
                  <div class="">{formatSlot(slot)}</div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="no-slots">Ingen ledige</div>
          {/if}
        </div>
        <a class="absolute right-2 bottom-1" href="/badstu/{name.replaceAll(' ', '-')}">Senere</a>
      </div>
    {/each}
  </div>
</div>

<BadstuMap />
