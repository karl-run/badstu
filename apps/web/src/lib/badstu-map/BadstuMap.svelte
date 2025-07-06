<script lang="ts">
  import MapLibre from 'svelte-maplibre/MapLibre.svelte'
  import DefaultMarker from 'svelte-maplibre/DefaultMarker.svelte'
  import Popup from 'svelte-maplibre/Popup.svelte'

  const markers: Array<{
    lngLat: [number, number]
    name: string
  }> = [
    {
      lngLat: [10.7991902, 59.9050309],
      name: 'Kruttverket',
    },
    {
      lngLat: [10.756673, 59.9314066],
      name: 'Sagene Folkebad',
    },
    {
      lngLat: [10.746916, 59.9080349],
      name: 'Langkaia',
    },
    {
      lngLat: [10.7503388, 59.9045554],
      name: 'Langkaia',
    },
  ]
</script>

<div class="relative h-[500px] w-full">
  <MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    standardControls
    zoom={11}
    center={[10.73, 59.92]}
  >
    {#each markers as { lngLat, name }}
      <!-- Unlike the custom marker example, default markers do not have mouse events,
        and popups only support the default openOn="click" behavior -->
      <DefaultMarker {lngLat} draggable>
        <Popup offset={[0, -10]}>
          <div class="text-lg font-bold">{name}</div>
        </Popup>
      </DefaultMarker>
    {/each}
  </MapLibre>
</div>
