<script lang="ts">
  import { getLink } from '@badstu/data/meta'
  import { ArrowRight, LocateFixed } from '@lucide/svelte'

  function formatSlot(slot: any) {
    return `${slot.time}–${slot.timeEnd} (${slot.available})`
  }

  const { location, slot }: { location: any; slot: any } = $props()
</script>

<a
  class="group flex h-14 justify-between p-2 transition-colors hover:bg-gray-400"
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
    <div class="-mt-1 text-xs">{slot.length} timer, totalt {slot.size} plasser</div>
  </div>
  <div class="mr-2 flex flex-col items-center justify-center">
    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
  </div>
</a>
