<script lang="ts">
  import * as R from 'remeda'

  import { Bomb } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date'
  import OtherDayPicker from '$lib/other-day-picker/OtherDayPicker.svelte'
  import BadstuDay from '$lib/badstu-day/BadstuDay.svelte'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Badstuer i Oslo toReadableDateWithWeekdayName(data.date)</title>
  <meta
    name="description"
    content={`Se hvilke badstuer i Oslo har ledig drop-in ${toReadableDateWithWeekdayName(data.date)}`}
  />
</svelte:head>

<div class="grid h-[calc(100svh-5rem)] grid-cols-1 grid-rows-[auto_1fr]">
  <div class="flex flex-col">
    <h2 class="shrink-0 p-4 pb-0 text-xl">Badstuer i Oslo {toReadableDateWithWeekdayName(data.date)}</h2>
    <div class="h-14">
      <OtherDayPicker activeDate={data.date} />
    </div>
  </div>
  <div class="mt-2 flex h-full max-w-screen gap-3 overflow-scroll px-3 pb-3 md:h-auto md:min-h-96">
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
      {#each R.entries(locations) as [name, location] (name)}
        <BadstuDay locationName={name} {location} />
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
