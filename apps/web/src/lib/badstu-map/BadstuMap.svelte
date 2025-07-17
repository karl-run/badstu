<script lang="ts">
  import { MapLibre, DefaultMarker, Popup } from 'svelte-maplibre'

  import { setMap } from './map.svelte'
  import { allBadstuLocations } from '@badstu/data/meta'

  const markers = Object.entries(allBadstuLocations).map(([name, location]) => ({
    lngLat: location.loc,
    name,
    location,
  }))

  const props: { class: string } = $props()
</script>

<div class={['relative', props.class]}>
  <MapLibre
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    zoom={11}
    center={[10.78, 59.92]}
    onload={setMap}
    attributionControl={{ compact: true }}
  >
    {#each markers as { lngLat, name, location } (name)}
      <DefaultMarker {lngLat} draggable>
        <Popup offset={[0, -10]} popupClass="max-w-64">
          <div class="text-lg font-bold">{name}</div>
          {#if location.ingress}
            <p>{location.ingress}</p>
          {/if}
          <div class="mt-2 flex justify-between gap-4">
            <a class="p-2 text-base underline" href={`/badstu/${name.replaceAll(' ', '-')}`}>Se ledighet</a>
            <a class="p-2 text-base underline" target="_blank" rel="nofollow noreferrer" href={location.maps}
              >Google maps</a
            >
          </div>
        </Popup>
      </DefaultMarker>
    {/each}
  </MapLibre>
</div>
