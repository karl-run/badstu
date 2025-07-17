import { ObfJob } from './common'
import { obfLocations } from '@badstu/data'

export const obfJobs = [
  new ObfJob('Svarttrosten', obfLocations['kroloftet-svarttrosten']),
  new ObfJob('Svarttrosten nakenbadstue', obfLocations['kroloftet-svarttrosten-naken']),
  new ObfJob('Svarttrosten nakenbadstue (kvinner)', obfLocations['kroloftet-svarttrosten-naken-kvinner']),
  new ObfJob('Jurten', obfLocations['kroloftet-jurten']),
  new ObfJob('Langkaia', obfLocations.langkaia),
  new ObfJob('Sukkerbiten', obfLocations.sukkerbiten),
  new ObfJob('Sagene med basseng', obfLocations['sagene-basseng']),
  new ObfJob('Sagene kun badstu (nakenhet)', obfLocations['sagene-badstu-naken']),
  new ObfJob('Sagene med basseng (nakenhet)', obfLocations['sagene-basseng-naken']),
  new ObfJob('Sagene med basseng (familie)', obfLocations['sagene-basseng-familie']),
]
