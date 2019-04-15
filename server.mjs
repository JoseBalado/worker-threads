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

Object.keys(workersPoll).forEach(id => {
  workersPoll[id].worker.on('message', msg => {
    console.log('message from worker: ', msg.id)
    executeWork()
  })
})

const executeWork = () => {
  if(interval.length === 0){
    Object.keys(workersPoll).forEach(id => workersPoll[id].worker.terminate())
    const diff = process.hrtime(time)
    console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)
  }

  const workersIndex = Object.keys(workersPoll)
  for(let id of workersIndex) {
    if(workersPoll[id].idle === true && interval.length > 0) {
      workersPoll[id].worker.postMessage({ id: `id${workersPoll[id].worker.threadId}`, interval: interval.pop() })
      workersPoll[id].idle = false
    }
  }
}

const NS_PER_SEC = 1e9
const time = process.hrtime()

workersPoll.id1.worker.on('message', msg => {
  // console.log('msg: ', msg)

  workersPoll.id1.idle = true

  console.log('Number of work to be completed', interval.length)
  executeWork()
})

executeWork()
