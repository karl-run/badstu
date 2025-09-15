import * as R from 'remeda'
import { obfLocations } from '@badstu/data'

import type { Job } from './common.ts'
import { ObfJob } from './obf-job.ts'
import { LebJob } from './leb-job.ts'

const obfJobs: Job[] = [
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

const lebJobs: Job[] = [
  new LebJob(0, 3),
  new LebJob(3, 3),
  new LebJob(6, 3),
  new LebJob(9, 3),
  new LebJob(12, 3),
  new LebJob(15, 3),
]

export const jobs: Job[] = R.zip(obfJobs, lebJobs).flat()
