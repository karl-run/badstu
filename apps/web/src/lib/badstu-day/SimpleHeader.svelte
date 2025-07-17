<script lang="ts">
  import { toReadableDateWithWeekdayName } from '$lib/utils/date'
  import DiffSinceTimer from '$lib/badstu-day/DiffSinceTimer.svelte'

  const { date, lastUpdated }: { date: string; lastUpdated: Date | null } = $props()
</script>

<div class="flex">
  <h3 class="flex w-full items-center justify-center p-2 text-xl font-bold text-gray-700 dark:text-gray-200">
    {toReadableDateWithWeekdayName(date)}
  </h3>
  {#if lastUpdated != null}
    <div class="mt-2 mr-2 flex flex-col items-center text-xs leading-3" title="Sist oppdatert">
      <div><DiffSinceTimer {lastUpdated} /></div>
      <div>min</div>
    </div>
  {/if}
</div>
