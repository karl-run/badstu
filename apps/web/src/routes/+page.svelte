<script lang="ts">
  import type { PageProps } from './$types'
  import BadstuMap from '$lib/badstu-map/BadstuMap.svelte'

  let { data }: PageProps = $props()
</script>

<div class="container p-4">
  <h1>Ledig nå i dag</h1>
  <div>{JSON.stringify(data.rows)}</div>
</div>

<div>
  <BadstuMap />
</div>
