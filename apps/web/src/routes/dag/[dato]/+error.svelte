<script>
  import { Bomb } from '@lucide/svelte'

  import OtherDayPicker from '$lib/other-day-picker/OtherDayPicker.svelte'
  import { toReadableDateWithWeekdayName } from '$lib/utils/date.js'
  import { page } from '$app/state'
</script>

<div class="grid h-[calc(100svh-5rem)] grid-cols-1 grid-rows-[auto_1fr]">
  <div class="flex flex-col">
    <h2 class="shrink-0 p-4 pb-0 text-xl">Badstuer i Oslo {toReadableDateWithWeekdayName(page.data.date)}</h2>
    <div class="h-14">
      <OtherDayPicker activeDate={page.data.date} from={0} />
    </div>
  </div>
  <div class="mt-2 flex h-full max-w-screen gap-3 overflow-scroll px-3 pb-3 md:h-auto md:min-h-96">
    <div class="flex grow flex-col flex-wrap items-center justify-center gap-4 rounded-xl p-8">
      <div class="flex gap-3">
        <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
        <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
        <Bomb class="ml-2 size-12 animate-bounce text-gray-500" />
      </div>
      <div>Kunne ikke laste badstutidene!!</div>
      <pre class="rounded-md bg-white p-1 px-2 text-black">{page.error?.message ?? 'Ukjent feil'}</pre>
      <div>Prøv igjen senere :)</div>
    </div>
  </div>
</div>
