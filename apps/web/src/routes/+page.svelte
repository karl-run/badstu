<script lang="ts">
  import * as R from 'remeda'
  import { onDestroy } from 'svelte'
  import { ArrowRight, LocateFixed } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { mapStore } from '$lib/badstu-map/map-store'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'
  import { type Map } from 'svelte-maplibre'
  import { allBadstuLocations, getLink } from '@badstu/data/meta'
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
      <div
        class="relative flex w-[calc(100vw-100px)] grow flex-col overflow-hidden rounded-2xl bg-gray-200 md:w-64 md:grow"
      >
        <a class="relative mb-1 h-18 bg-black hover:bg-blue-100" href="/badstu/{name.replaceAll(' ', '-')}">
          <BadstuCovers
            location={name}
            class="pointer-events-none absolute inset-0 top-0 left-0  h-full w-full opacity-70"
          />
          <h2
            class="flex h-full w-full items-center justify-center text-xl font-bold text-white drop-shadow-md drop-shadow-black"
          >
            {name}
          </h2>
        </a>
        <div>
          {#if location.slots.length > 0}
            <div class="divide-y divide-gray-400">
              {#each location.slots as slot}
                <a
                  class="flex h-12 flex-col justify-center p-2 hover:bg-gray-400"
                  href={getLink(location.provider, slot.variation.key, location.date)}
                >
                  {#if location.variations > 1 || slot.variation != null}
                    <div class="text-xs">{slot.variation.text}</div>
                  {/if}
                  <div class="">{formatSlot(slot)}</div>
                </a>
              {/each}
            </div>
          {:else}
            <div class="no-slots">Ingen ledige</div>
          {/if}
        </div>
        <div class="grow"></div>
        <div class="flex justify-between">
          <button
            class="m-1 ml-2 cursor-pointer rounded-full p-2 hover:shadow-2xl hover:outline-1"
            onclick={() => {
              const location = allBadstuLocations[name]
              if (!location || !location.loc) {
                console.error(`No location found for ${name}`)
                return
              }

              return map?.flyTo({ center: location.loc, zoom: 15 })
            }}
          >
            <LocateFixed aria-label="zoom to location" class="h-5 w-5" />
          </button>
          <a class="mr-2 flex items-center gap-1" href="/badstu/{name.replaceAll(' ', '-')}"
            >Andre dager <ArrowRight class="h-4 w-4" /></a
          >
        </div>
      </div>
    {/each}
  </div>
</div>

<BadstuMap />
