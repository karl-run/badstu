<script lang="ts">
  import type { PageProps } from './$types'
  import { LoaderCircle, Bomb } from '@lucide/svelte'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'
  import * as R from 'remeda'
  import BadstuDay from '$lib/badstu-day/BadstuDay.svelte'
  import RefetchButton from '$lib/refetch-button/RefetchButton.svelte'
  import { useWindowFocus } from '$lib/utils/on-focus'
  import { invalidate } from '$app/navigation'

  let { data }: PageProps = $props()

  useWindowFocus(() => {
    invalidate(`badstu:${data.slugLocation}`)
  })
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
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
      <div
        class="flex min-h-[380px] grow animate-pulse flex-wrap items-center justify-center rounded-xl bg-gray-200 dark:bg-slate-800"
      >
        <LoaderCircle class="size-12 animate-spin opacity-50" aria-hidden />
      </div>
    {:then avails}
      <RefetchButton
        timestamps={R.values(avails)
          .flatMap((it) => it.updated)
          .filter(R.isNonNull)}
        tag={`badstu:${data.slugLocation}`}
      />
      {#each R.entries(avails) as [date, availability] (date)}
        <BadstuDay
          class="w-full max-w-none md:w-auto"
          locationName={data.name}
          location={availability}
          fullHeight
          compact
        />
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
