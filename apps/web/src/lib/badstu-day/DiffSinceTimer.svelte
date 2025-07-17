<script lang="ts">
  import { differenceInMinutes } from 'date-fns'
  import { onMount } from 'svelte'

  const { lastUpdated }: { lastUpdated: Date } = $props()

  let counter = $state(0)

  onMount(() => {
    const interval = setInterval(() => {
      counter++
    }, 30_000)

    return () => {
      clearInterval(interval)
    }
  })
</script>

{#key counter}
  <span>{differenceInMinutes(new Date(), lastUpdated, { roundingMethod: 'round' })}</span>
{/key}
