<script lang="ts">
  import { ArrowRight, CircleDashed, LocateFixed } from '@lucide/svelte'

  import { type AllLocationNames } from '@badstu/data/meta'
  import { type BadstuAvailability } from '@badstu/db/slots'

  import RowLink from '$lib/slots/RowLink.svelte'
  import CoverHeader from '$lib/badstu-day/CoverHeader.svelte'
  import SimpleHeader from '$lib/badstu-day/SimpleHeader.svelte'

  const {
    locationName,
    location,
    onLocateClick,
    compact = false,
    fullHeight = false,
    ...rest
  }: {
    locationName: AllLocationNames
    location: BadstuAvailability
    compact?: boolean
    fullHeight?: boolean
    onLocateClick?: () => void
    class?: string
  } = $props()
</script>

<div
  class={[
    rest.class,
    'relative w-full max-w-[calc(100vw-100px)] min-w-72 grow rounded-2xl bg-gray-200 md:w-64 md:grow dark:bg-slate-800',
  ]}
>
  <div class="flex h-full flex-col rounded-2xl">
    {#if !compact}
      <CoverHeader name={locationName} lastUpdated={location.updated} />
    {:else}
      <SimpleHeader date={location.date} lastUpdated={location.updated} />
    {/if}
    <div class={['relative h-full', fullHeight ? 'overflow-auto' : 'overflow-y-scroll']}>
      {#if location.slots.length > 0}
        <div class="divide-y divide-gray-400">
          {#each location.slots as slot}
            <RowLink {location} {slot} />
          {/each}
        </div>
      {:else}
        <div class="mt-4 flex h-2/3 flex-col items-center justify-center gap-2 p-4 opacity-70">
          <CircleDashed class="ml-2 h-12 w-12 shrink-0 text-gray-500" />
          <div>Ingen bookinger denne dagen</div>
        </div>
      {/if}
      {#if !fullHeight}
        <div
          class="pointer-events-none sticky bottom-0 left-0 h-4 w-full bg-gradient-to-b from-transparent to-gray-200 dark:to-slate-800"
        ></div>
      {/if}
    </div>
    <div class="grow"></div>
    <div class="m-2 flex justify-end [&:has(button)]:justify-between">
      {#if onLocateClick != null}
        <button class="cursor-pointer rounded-full p-2 hover:shadow-2xl hover:outline-1" onclick={onLocateClick}>
          <LocateFixed aria-label="zoom to location" class="h-5 w-5" />
        </button>
      {/if}
      {#if !compact}
        <a class="mr-2 flex items-center gap-1 hover:underline" href="/badstu/{locationName.replaceAll(' ', '-')}"
          >Andre dager <ArrowRight class="h-4 w-4" /></a
        >
      {/if}
    </div>
  </div>
</div>
