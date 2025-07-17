<script lang="ts">
  import { RefreshCw } from '@lucide/svelte'

  let clicked = $state(false)

  const { onClick }: { onClick: () => void } = $props()
</script>

<button
  class={[
    'rounded-full border border-gray-700 bg-gray-200 p-2 shadow-md hover:border-blue-900 dark:bg-slate-600',
    clicked && 'animate-spin',
  ]}
  onclick={() => {
    clicked = true
    onClick()
  }}><RefreshCw /></button
>
