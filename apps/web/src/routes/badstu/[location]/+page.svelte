<script lang="ts">
  import type { PageProps } from './$types'
  import { CircleDashed, LoaderCircle, Bomb } from '@lucide/svelte'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'
  import * as R from 'remeda'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date'
  import RowLink from '$lib/slots/RowLink.svelte'
  import { differenceInMinutes } from 'date-fns'

  let { data }: PageProps = $props()
</script>

<svelte:head>
  <title>{data.name} | Ledige tider</title>
  <meta name="description" content={`Ledige tider for badstu og basseng på ${data.name} de neste dagene`} />
</svelte:head>

<header class="relative h-64 p-4">
  <BadstuCovers class="absolute top-0 left-0 -z-10 h-full w-full" location={data.name} />
  <h2
    class="flex h-full w-full items-center justify-center text-3xl font-bold text-white drop-shadow-md drop-shadow-black sm:text-5xl"
  >
    {data.name}
  </h2>
</header>

<div class="container mx-auto p-4">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#await data.availability}
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200">
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
    {:then avails}
      {#each R.entries(avails) as [date, availability]}
        <div class="grow flex-wrap rounded-xl bg-gray-200">
          <div class="flex">
            <h3 class="flex w-full items-center justify-center p-2 text-xl font-bold text-gray-700">
              {toReadableDateWithWeekdayName(date)}
            </h3>
            {#if availability.updated != null}
              <div class="mt-2 mr-2 flex flex-col items-center text-xs leading-3" title="Sist oppdatert">
                <div>{differenceInMinutes(new Date(), availability.updated, { roundingMethod: 'round' })}</div>
                <div>min</div>
              </div>
            {/if}
          </div>
          {#if availability.slots.length > 0}
            <div class="divide-y divide-gray-400">
              {#each availability.slots as slot}
                <RowLink {slot} location={availability} />
              {/each}
            </div>
          {:else}
            <div class="flex h-2/3 flex-col items-center justify-center gap-2 p-4 opacity-70">
              <CircleDashed class="ml-2 h-12 w-12 text-gray-500" />
              <div>Ingen bookinger denne dagen</div>
            </div>
          {/if}
        </div>
      {/each}
    {:catch error}
      <div class="flex grow flex-col flex-wrap items-center justify-center gap-4 rounded-xl bg-gray-200 p-8">
        <div class="flex gap-3">
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
          <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
        </div>
        <div>Kunne ikke laste inn bookinger for {data.name} :(</div>
        <pre class="rounded-md bg-white p-1 px-2">{error.message}</pre>
        <div>Prøv igjen senere!</div>
      </div>
    {/await}
  </div>
</div>
