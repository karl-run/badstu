<script lang="ts">
  import { getLink } from '@badstu/data/meta'
  import { ArrowRight } from '@lucide/svelte'
  import { addMinutes, isAfter } from 'date-fns'
  import { dateAndTimeToDate } from '$lib/utils/date'

  const { location, slot }: { location: { provider: 'obf'; date: string; variations: number }; slot: any } = $props()
  const isTooLate = isAfter(new Date(), addMinutes(dateAndTimeToDate(location.date, slot.time), 60))
</script>

<a
  class={['group flex h-14 justify-between p-2 transition-colors hover:bg-gray-400', isTooLate && 'opacity-50']}
  href={getLink(location.provider, slot.variation.key, location.date)}
>
  <div class="flex flex-col justify-center">
    {#if location.variations > 1 || slot.variation != null}
      <div class="-mb-1 text-xs">{slot.variation.text}</div>
    {/if}
    <div class="flex gap-2">
      <div class="">{slot.time}</div>
      <div>{slot.available} ledige</div>
    </div>
    <div class="-mt-1 text-xs">Til {slot.timeEnd} ({slot.length}t), totalt {slot.size} plasser</div>
  </div>
  <div class="mr-2 flex flex-col items-center justify-center">
    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
  </div>
</a>
