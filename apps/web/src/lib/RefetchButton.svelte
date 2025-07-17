<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { RefreshCw } from '@lucide/svelte'
  import { differenceInMinutes } from 'date-fns'
  import { invalidate } from '$app/navigation'

  const { tag, timestamps }: { tag: string; timestamps: Date[] } = $props()

  let hasAnyMoreThan3MinutesAgo = $state(false)

  onMount(() => {
    const interval = setInterval(() => {
      const now = new Date()
      hasAnyMoreThan3MinutesAgo = timestamps.some((ts) => differenceInMinutes(now, ts) >= 4)
    }, 15_000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

{#if hasAnyMoreThan3MinutesAgo}
  <div class="fixed top-3 right-3" transition:fly={{ x: 100 }}>
    <button
      class="rounded-full border border-gray-700 bg-gray-200 p-2 shadow-md dark:bg-slate-600"
      onclick={() => {
        invalidate(tag)
      }}><RefreshCw /></button
    >
  </div>
{/if}
