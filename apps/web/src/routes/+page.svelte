<script lang="ts">
  import * as R from 'remeda'
  import { Bomb } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { allBadstuLocations } from '@badstu/data/meta'
  import { mapState } from '$lib/badstu-map/map.svelte'
  import OtherDayPicker from '$lib/other-day-picker/OtherDayPicker.svelte'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'
  import BadstuDay from '$lib/badstu-day/BadstuDay.svelte'
  import RefetchButton from '$lib/refetch-button/RefetchButton.svelte'
  import { useWindowFocus } from '$lib/utils/on-focus'
  import { invalidate } from '$app/navigation'

  const { data }: PageProps = $props()

  useWindowFocus(() => {
    invalidate('badstu:today')
  })
</script>

<svelte:head>
  <title>Badstuer i Oslo</title>
  <meta name="description" content="Se hvilke badstuer i Oslo har ledig drop-in i dag og fremover i tid!" />
</svelte:head>

<div class="grid h-[calc(100svh-4rem)] grid-cols-1 grid-rows-[calc(70svh-4rem)_30svh]">
  <div class="flex flex-col">
    <div class="flex">
      <h2 class="shrink-0 p-4 text-xl">Badstuer i dag</h2>
      <OtherDayPicker />
    </div>
    <div class="mt-2 flex h-full max-w-screen gap-3 overflow-auto px-3 pb-3 md:h-auto md:min-h-96">
      {#await data.locations}
        <div
          class="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"
        ></div>
        <div
          class="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"
        ></div>
        <div
          class="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"
        ></div>
        <div
          class="relative h-full w-full max-w-[calc(100vw-100px)] min-w-72 grow animate-pulse rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800"
        ></div>
      {:then locations}
        <RefetchButton
          timestamps={R.values(locations)
            .flatMap((it) => it.updated)
            .filter(R.isNonNull)}
          tag="badstu:today"
        />
        {#each R.entries(locations) as [name, location] (name)}
          <BadstuDay
            class="grow"
            locationName={name}
            {location}
            onLocateClick={() => {
              const location = allBadstuLocations[name]
              if (!location || !location.loc) {
                console.error(`No location found for ${name}`)
                return
              }

              mapState.map?.flyTo({ center: location.loc, zoom: 15 })
            }}
          />
        {/each}
      {:catch error}
        <div class="flex grow flex-col flex-wrap items-center justify-center gap-4 rounded-xl bg-gray-200 p-8">
          <div class="flex gap-3">
            <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
            <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
            <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
          </div>
          <div>Kunne ikke laste badstutidene!!</div>
          <pre class="rounded-md bg-white p-1 px-2">{error.message}</pre>
          <div>Prøv igjen senere :)</div>
        </div>
      {/await}
    </div>
  </div>

  <div>
    <BadstuMap class="h-full w-full" />
  </div>
</div>
