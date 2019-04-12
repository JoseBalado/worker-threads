import { Worker } from 'worker_threads'
import os from 'os'

const interval = []
let index = 0
while (index < 1000000000) {
  interval.push({ start: index, end: index += 99999999 })
  index++
}

console.log('interval', interval)

const workersPoll = []
for (let index = 0; index < (os.cpus().length - 1); index++) {
  workersPoll.push(new Worker('./worker-thread.mjs'))
}

workersPoll[0].postMessage(interval.pop())

const NS_PER_SEC = 1e9
const time = process.hrtime()

workersPoll[0].on('message', msg => {
  // console.log('msg: ', msg)
  const diff = process.hrtime(time)

  console.log('il', interval.length)
  if(interval.length === 0) {
    interval.length || workersPoll[0].terminate()
    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)
  }
  interval.length && workersPoll[0].postMessage(interval.pop())
})

workersPoll[0].on('exit', param => {
  console.log('worker exits', param)

  // Needed to finish with node application
  workersPoll.map(worker => worker.terminate())
})
