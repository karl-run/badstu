import { ObfJob } from './common'
import { obfLocations } from '@badstu/data'

export const obfJobs = [
  new ObfJob('Svarttrosten', obfLocations.kroloftet),
  new ObfJob('Sagene med basseng', obfLocations.sagene['badstu/bad u/ nakenhet']),
  new ObfJob('Sagene kun badstu (nakenhet)', obfLocations.sagene['badstu m/ nakenhet']),
  new ObfJob('Sagene med basseng (nakenhet)', obfLocations.sagene['badstu/bad m/ nakenhet']),
]
