import { getDropin, obfLocations } from '@badstu/data'
import { ObfJob } from './jobs/obf-job.ts'
import { LebJob } from './jobs/leb-job.ts'
import type { Job } from './jobs/common.ts'

/*

const days = await getDropin(obfLocations['sagene-basseng'])

console.log(days.filter((it) => it.date === '2025-07-20'))
 */

/*
const job = new ObfJob('Sagene med basseng', obfLocations['sagene-basseng'])

await job.doWorkWithLock()
*/

const lebJobs: Job[] = [new LebJob(0, 3), new LebJob(3, 3)]

for (const job of lebJobs) {
  await job.doWorkWithLock()
}
