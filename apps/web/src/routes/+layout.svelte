<script lang="ts">
  import '../app.css'

  let { children } = $props()
</script>

<header class="flex h-16 items-center justify-between border-b border-b-gray-300 bg-gray-100">
  <h1 class="ml-4 text-2xl text-gray-800">Badstuer i Oslo</h1>
  <div class="mr-6">Log inn</div>
</header>

{@render children()}
