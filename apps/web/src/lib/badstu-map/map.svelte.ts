import type { Map } from 'svelte-maplibre'

export const mapState = $state<{ map: Map | undefined }>({ map: undefined })

export function setMap(newMap: Map) {
  mapState.map = newMap
}
