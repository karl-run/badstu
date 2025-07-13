<script lang="ts">
  import type { PageProps } from './$types'
  import { CircleDashed } from '@lucide/svelte'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'
  import * as R from 'remeda'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date'
  import RowLink from '$lib/slots/RowLink.svelte'

  let { data }: PageProps = $props()
</script>

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
    {#each R.entries(data.availability) as [date, availability]}
      <div class="grow flex-wrap rounded-xl bg-gray-200">
        <h3 class="flex w-full items-center justify-center p-2 text-xl font-bold text-gray-700">
          {toReadableDateWithWeekdayName(date)}
        </h3>
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
  </div>
</div>
