import { writable } from 'svelte/store'
import type { Map } from 'svelte-maplibre'

export const mapStore = writable<Map | null>(null)
