<script lang="ts">
  import type { PageProps } from './$types'
  import BadstuCovers from '$lib/covers/BadstuCovers.svelte'

  let { data }: PageProps = $props()
</script>

<header class="relative h-64">
  <BadstuCovers class="absolute top-0 left-0 -z-10 h-full w-full" location={data.name} />
  <h2
    class="flex h-full w-full items-center justify-center text-5xl font-bold text-white drop-shadow-md drop-shadow-black"
  >
    {data.name}
  </h2>
</header>
<div>hallo</div>

<pre>
    {JSON.stringify(data, null, 2)}
</pre>
