<script>
  import * as R from 'remeda'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date.js'
  import { addDays, formatISO } from 'date-fns'

  const today = new Date()
  const next21Days = R.range(1, 21).map((offset) => formatISO(addDays(today, offset), { representation: 'date' }))
</script>

<div class="relative flex h-full gap-1 overflow-auto px-4 py-2">
  {#each next21Days as dateString}
    <a href={`/dag/${dateString}`} class="flex h-full shrink-0 items-center rounded-md px-2 text-sm hover:bg-gray-200"
      >{toReadableDateWithWeekdayName(dateString)}</a
    >
  {/each}
  <div class="absolute right-0 bottom-0 h-full w-4 bg-gradient-to-r from-transparent to-white"></div>
  <div class="absolute bottom-0 left-0 h-full w-4 bg-gradient-to-l from-transparent to-white"></div>
</div>
