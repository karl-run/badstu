<script lang="ts">
  import * as R from 'remeda'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date.js'
  import { addDays, formatISO } from 'date-fns'

  const { activeDate, from = 1 }: { activeDate?: string; from?: number } = $props()

  const today = new Date()
  const next21Days = R.range(from, 21).map((offset) => formatISO(addDays(today, offset), { representation: 'date' }))

  $effect(() => {
    if (!activeDate) return

    const activeNode = document.getElementById(`date-${activeDate}`)

    if (activeNode) {
      activeNode.scrollIntoView({ behavior: 'smooth', inline: 'center' })
    }
  })
</script>

<div class="relative flex h-full overflow-hidden">
  <div
    class="pointer-events-none absolute right-0 bottom-0 h-full w-4 shrink-0 bg-gradient-to-r from-transparent to-white dark:to-slate-900"
  ></div>
  <div class="flex h-full gap-1 overflow-auto px-4 py-2">
    {#each next21Days as dateString (dateString)}
      <a
        id={`date-${dateString}`}
        href={`/dag/${dateString}`}
        class={[
          'flex h-full shrink-0 items-center rounded-md px-2 text-sm hover:bg-gray-200 hover:dark:bg-blue-800',
          dateString === activeDate &&
            'border border-dashed border-blue-600 bg-blue-200 dark:border-slate-700 dark:bg-blue-950 dark:text-white',
        ]}>{toReadableDateWithWeekdayName(dateString)}</a
      >
    {/each}
  </div>
  <div
    class="pointer-events-none absolute bottom-0 left-0 h-full w-4 shrink-0 bg-gradient-to-l from-transparent to-white dark:to-slate-900"
  ></div>
</div>
