<script lang="ts">
  import * as R from 'remeda'
  import { onDestroy } from 'svelte'
  import { ArrowRight, LocateFixed, CircleDashed } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { mapStore } from '$lib/badstu-map/map-store'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'
  import { type Map } from 'svelte-maplibre'
  import { allBadstuLocations, getLink } from '@badstu/data/meta'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'
  import RowLink from '$lib/slots/RowLink.svelte'

  let map: Map | null = $state(null)
  const unsubscribe = mapStore.subscribe((m) => {
    map = m
  })

  onDestroy(unsubscribe)

  let { data }: PageProps = $props()
</script>

<div class="grid h-[calc(100vh-4rem)] grid-cols-1 grid-rows-[calc(70vh-4rem)_30vh]">
  <div class="flex flex-col">
    <h2 class="p-4 text-xl">Badstuer i dag</h2>
    <div class="flex max-w-screen gap-3 overflow-scroll px-3 pb-3">
      {#each R.entries(data.locations) as [name, location]}
        <div class="relative w-full max-w-[calc(100vw-100px)] min-w-72 grow rounded-2xl bg-gray-200 md:w-64 md:grow">
          <div class="flex h-full flex-col rounded-2xl">
            <a class="group relative h-18 shrink-0" href="/badstu/{name.replaceAll(' ', '-')}">
              <BadstuCovers
                location={name}
                class="pointer-events-none absolute inset-0 top-0 left-0 h-full w-full rounded-t-2xl opacity-70 group-hover:opacity-100"
              />
              <h2
                class="flex h-full w-full items-center justify-center text-xl font-bold text-white drop-shadow-md drop-shadow-black"
              >
                {name}
              </h2>
            </a>
            <div class="relative h-full overflow-y-scroll">
              {#if location.slots.length > 0}
                <div class="divide-y divide-gray-400">
                  {#each location.slots as slot}
                    <RowLink {location} {slot} />
                  {/each}
                </div>
              {:else}
                <div class="flex h-2/3 flex-col items-center justify-center gap-2 p-4 opacity-70">
                  <CircleDashed class="ml-2 h-12 w-12 text-gray-500" />
                  <div>Ingen bookinger denne dagen</div>
                </div>
              {/if}
              <div class="sticky bottom-0 left-0 h-4 w-full bg-gradient-to-b from-transparent to-gray-200"></div>
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

                  map?.flyTo({ center: location.loc, zoom: 15 })
                }}
              >
                <LocateFixed aria-label="zoom to location" class="h-5 w-5" />
              </button>
              <a class="mr-2 flex items-center gap-1" href="/badstu/{name.replaceAll(' ', '-')}"
                >Andre dager <ArrowRight class="h-4 w-4" /></a
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div>
    <BadstuMap class="h-full w-full" />
  </div>
</div>
