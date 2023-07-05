import kroloftet from './kroloftet.jpeg';
import sukkerbiten from './sukkerbiten.jpg';
import langkaia from './langkaia.jpeg';

import { Location } from '@/scraping/metadata';

export const images: Record<Location, typeof kroloftet> = {
  kroloftet: kroloftet,
  sukkerbiten: sukkerbiten,
  langkaia: langkaia,
  // sukkerbiten_nakenbadstu: sukkerbiten,
};
