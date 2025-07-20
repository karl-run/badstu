import { getDropin, obfLocations } from '@badstu/data'
import { ObfJob } from './jobs/common.ts'

/*

const days = await getDropin(obfLocations['sagene-basseng'])

console.log(days.filter((it) => it.date === '2025-07-20'))
 */

const job = new ObfJob('Sagene med basseng', obfLocations['sagene-basseng'])

await job.doWorkWithLock()
