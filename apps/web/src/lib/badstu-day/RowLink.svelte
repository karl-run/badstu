<script lang="ts">
  import { getLink } from '@badstu/data/meta'
  import { ArrowRight } from '@lucide/svelte'
  import { addMinutes, isAfter } from 'date-fns'
  import { dateAndTimeToDate } from '$lib/utils/date'
  import type { BadstuAvailability } from '@badstu/db/slots'

  const {
    location,
    slot,
  }: { location: { provider: 'obf'; date: string; variations: number }; slot: BadstuAvailability['slots'][number] } =
    $props()
  const isTooLate = isAfter(new Date(), addMinutes(dateAndTimeToDate(location.date, slot.time), 60))

  console.log(location.variations > 1 || slot.variation != null)
</script>

<a
  class={[
    'group flex h-14 justify-between transition-colors hover:bg-gray-400 dark:hover:bg-blue-950',
    isTooLate && 'opacity-50',
  ]}
  href={getLink(location.provider, slot.variation.key, location.date)}
>
  <div class="flex size-14 flex-col items-center justify-center">
    <div class="-mt-1 -mb-1.5 text-xl">{slot.available}</div>
    <div class="text-xs">av {slot.size}</div>
  </div>
  <div class="flex grow flex-col justify-center">
    <div class="leading-4">
      {slot.time} til {slot.timeEnd} ({slot.length}t)
    </div>
    {#if location.variations > 1 && slot.variation != null}
      <div class="text-xs">{slot.variation.text}</div>
    {:else}
      <div class="text-xs">Fellesbadstue</div>
    {/if}
  </div>
  <div class="mr-2 flex flex-col items-center justify-center">
    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
  </div>
</a>
