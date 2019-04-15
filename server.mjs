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

const workerOnMessage = id => message => {
  console.log('-- message from worker:', id, ', Number of works to be completed', interval.length, ', Message[0]: ', message[0])
  workersPoll[id].idle = true

  // Terminate this thread if there is no more work to be done
  interval.length || workersPoll[id].worker.terminate()

  executeWork()
}

Object.keys(workersPoll).forEach(id => {
  workersPoll[id].worker.on('message', workerOnMessage(id))
})

const NS_PER_SEC = 1e9
const time = process.hrtime()

const executeWork = () => {
  console.log('// in executeWork() function')

  const workersIndex = Object.keys(workersPoll)
  for (let id of workersIndex) {
    if (workersPoll[id].idle === true && interval.length > 0) {
      workersPoll[id].worker.postMessage(interval.pop())
      workersPoll[id].idle = false
    }
  }

  // Code to benchmark time
  if (interval.length === 0) {
    let allWorkersIdle = true
    for (let id of workersIndex) {
      if (workersPoll[id].idle === false) {
        allWorkersIdle = false
      }
    }
    if (allWorkersIdle) {
      const diff = process.hrtime(time)
      console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)
    }
  }
}

executeWork()
