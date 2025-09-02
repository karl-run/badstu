import type { AllLocationNames } from '@badstu/data/meta'
import Image from 'next/image'
import kroloftet from '@/assets/kroloftet.jpeg'
import langkaia from '@/assets/langkaia.jpeg'
import sukkerbiten from '@/assets/sukkerbiten.jpg'
import sagene from '@/assets/sagene.jpg'

interface BadstuCoversProps {
  location: AllLocationNames
  className?: string
}

export default function BadstuCovers({ location, className }: BadstuCoversProps) {
  const getImageData = () => {
    switch (location) {
      case 'Sagene Folkebad':
        return { src: sagene, offset: 61 }
      case 'Langkaia':
        return { src: langkaia, offset: 50 }
      case 'Sukkerbiten':
        return { src: sukkerbiten, offset: 45 }
      case 'Kroloftet':
        return { src: kroloftet, offset: 48 }
      default:
        return { src: sagene, offset: 50 }
    }
  }

  const { src, offset } = getImageData()

  return (
    <Image
      src={src}
      alt=""
      fill
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: `0 ${offset}%`,
      }}
      priority
    />
  )
}
