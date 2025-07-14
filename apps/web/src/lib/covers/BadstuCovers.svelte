<script lang="ts">
  import kroloftet from '$lib/assets/kroloftet.jpeg?enhanced'
  import langkaia from '$lib/assets/langkaia.jpeg?enhanced'
  import sukkerbiten from '$lib/assets/sukkerbiten.jpg?enhanced'
  import sagene from '$lib/assets/sagene.jpg?enhanced'

  import { type AllLocationNames } from '@badstu/data/meta'

  const props: { location: AllLocationNames; class: string } = $props()
  const [imageSrc, offset] = $derived.by(() => {
    switch (props.location) {
      case 'Sagene Folkebad':
        return [sagene, 61] as const
      case 'Langkaia':
        return [langkaia, 50] as const
      case 'Sukkerbiten':
        return [sukkerbiten, 45] as const
      case 'Kroloftet':
        return [kroloftet, 48] as const
    }
  })
</script>

<enhanced:img class={['image', props.class]} src={imageSrc} alt="" style="--offset: {offset}%" fetchpriority="high" />

<style>
  .image {
    object-fit: cover;
    object-position: 0 var(--offset);
  }
</style>
