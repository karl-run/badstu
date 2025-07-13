import { ObfJob } from './common'
import { obfLocations } from '@badstu/data'

export const obfJobs = [
  new ObfJob('Svarttrosten', obfLocations.kroloftet.svarttrosten),
  new ObfJob('Svarttrosten nakenbadstue', obfLocations.kroloftet['svarttrosten nakenbadstue']),
  new ObfJob('Svarttrosten nakenbadstue (kvinner)', obfLocations.kroloftet['svarttrosten nakenbadsue (kvinner)']),
  new ObfJob('Jurten', obfLocations.kroloftet.jurten),
  new ObfJob('Svarttrosten', obfLocations.kroloftet.svarttrosten),
  new ObfJob('Langkaia', obfLocations.langkaia),
  new ObfJob('Sukkerbiten', obfLocations.sukkerbiten),
  new ObfJob('Sagene med basseng', obfLocations.sagene['badstu/bad u/ nakenhet']),
  new ObfJob('Sagene kun badstu (nakenhet)', obfLocations.sagene['badstu m/ nakenhet']),
  new ObfJob('Sagene med basseng (nakenhet)', obfLocations.sagene['badstu/bad m/ nakenhet']),
]
