<script lang="ts">
  import type { Map } from 'svelte-maplibre'
  import { MapLibre, DefaultMarker, Popup } from 'svelte-maplibre'

  import { mapStore } from './map-store'
  import { allBadstuLocations } from '@badstu/data/meta'

  function onMapLoad(map: Map) {
    mapStore.set(map)
  }

  const markers: Array<{
    lngLat: [number, number]
    name: string
  }> = Object.entries(allBadstuLocations).map(([name, location]) => ({ lngLat: location.loc, name: name }))

  const props: { class: string } = $props()
</script>

<div class={['relative', props.class]}>
  <MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    zoom={11}
    center={[10.73, 59.92]}
    onload={onMapLoad}
    attributionControl={{ compact: true }}
  >
    {#each markers as { lngLat, name }}
      <DefaultMarker {lngLat} draggable>
        <Popup offset={[0, -10]}>
          <div class="text-lg font-bold">{name}</div>
        </Popup>
      </DefaultMarker>
    {/each}
  </MapLibre>
</div>
