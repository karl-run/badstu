<script lang="ts">
  import kroloftet from '$lib/assets/kroloftet.jpeg'
  import langkaia from '$lib/assets/langkaia.jpeg'
  import sukkerbiten from '$lib/assets/sukkerbiten.jpg'
  import sagene from '$lib/assets/sagene.jpg'

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

<img class={['image', props.class]} src={imageSrc} alt="Image" style="--offset: {offset}%" />

<style>
  .image {
    object-fit: cover;
    object-position: 0 var(--offset);
  }
</style>
