<script lang="ts">
  import * as R from 'remeda'

  import { Bomb } from '@lucide/svelte'

  import type { PageProps } from './$types'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date'
  import OtherDayPicker from '$lib/other-day-picker/OtherDayPicker.svelte'
  import BadstuDay from '$lib/badstu-day/BadstuDay.svelte'
  import RefetchButton from '$lib/refetch-button/RefetchButton.svelte'
  import { useWindowFocus } from '$lib/utils/on-focus'
  import { invalidate } from '$app/navigation'

  let { data }: PageProps = $props()

  useWindowFocus(() => {
    invalidate(`badstu:${data.date}`)
  })
</script>

<svelte:head>
  <title>Badstuer i Oslo {toReadableDateWithWeekdayName(data.date)}</title>
  <meta
    name="description"
    content={`Se hvilke badstuer i Oslo har ledig drop-in ${toReadableDateWithWeekdayName(data.date)}`}
  />
</svelte:head>

<div class="grid h-[calc(100svh-5rem)] grid-cols-1 grid-rows-[auto_1fr]">
  <div class="flex flex-col">
    <h2 class="shrink-0 p-4 pb-0 text-xl">Badstuer i Oslo {toReadableDateWithWeekdayName(data.date)}</h2>
    <div class="h-14">
      <OtherDayPicker activeDate={data.date} from={0} />
    </div>
  </div>
  <div class="mt-2 flex h-full max-w-screen gap-3 overflow-scroll px-3 pb-3 md:h-auto md:min-h-96">
    <RefetchButton
      timestamps={R.values(data.locations)
        .flatMap((it) => it.updated)
        .filter(R.isNonNull)}
      tag={`badstu:${data.date}`}
    />
    {#each R.entries(data.locations) as [name, location] (name)}
      <BadstuDay class="grow" locationName={name} {location} />
    {/each}
  </div>
</div>
