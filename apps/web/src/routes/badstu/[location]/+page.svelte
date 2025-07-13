<script lang="ts">
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
</script>

<div>hallo</div>

<pre>
    {JSON.stringify(data, null, 2)}
</pre>
