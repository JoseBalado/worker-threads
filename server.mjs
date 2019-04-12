import { Worker } from 'worker_threads'
import os from 'os'

const interval = []
let index = 0
while (index < 100000000) {
  interval.push({ start: index, end: index += 9999999 })
  index++
}

console.log('interval', interval)

const workersPoll = {}
for (let index = 0; index < (os.cpus().length - 1); index++) {
  const worker = new Worker('./worker-thread.mjs')
  workersPoll[`id${worker.threadId}`] = { idle: true, worker }
}

const executeWork = () => {
  workersPoll.id1.worker.postMessage({ id: 'id0', interval: interval.pop() })
  workersPoll.id1.idle = false
}

const NS_PER_SEC = 1e9
const time = process.hrtime()

workersPoll.id1.worker.on('message', msg => {
  // console.log('msg: ', msg)
  const diff = process.hrtime(time)

  console.log('il', interval.length)
  if(interval.length === 0) {
    interval.length || workersPoll.id1.worker.terminate()
    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)
  }
  interval.length && executeWork()
})

workersPoll.id1.worker.on('exit', param => {
  console.log('worker exits', param)

  // Needed to finish with node application
  Object.keys(workersPoll).forEach(id => workersPoll[id].worker.terminate())
})

executeWork()
