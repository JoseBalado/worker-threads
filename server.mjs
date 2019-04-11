import { Worker } from 'worker_threads'

const worker = new Worker('./worker-thread.mjs')

const NS_PER_SEC = 1e9
const time = process.hrtime()

worker.on('message', msg => {
  console.log(msg[0])
  const diff = process.hrtime(time)
  console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)
})
