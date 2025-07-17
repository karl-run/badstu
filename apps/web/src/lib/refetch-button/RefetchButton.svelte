<script lang="ts">
  import { onMount } from 'svelte'
  import { fly } from 'svelte/transition'
  import { differenceInMinutes } from 'date-fns'
  import { invalidate } from '$app/navigation'
  import RefetchSpinWhenClickedButton from '$lib/refetch-button/RefetchSpinWhenClickedButton.svelte'

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
  <div class="fixed top-3 right-3 z-10" transition:fly={{ x: 100 }}>
    <RefetchSpinWhenClickedButton
      onClick={() => {
        invalidate(tag)
      }}
    />
  </div>
{/if}
