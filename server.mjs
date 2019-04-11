import { Worker } from 'worker_threads'
import os from 'os'

const cpus = os.cpus().length

console.log(cpus)

const interval = []

let index = 0
while (index < 100000) {
  interval.push({ start: index, range: index += 9999 })
  index++
}

console.log('interval', interval)

const worker = new Worker('./worker-thread.mjs')

worker.postMessage({ start: interval[0].start, range: interval[0].range })

const NS_PER_SEC = 1e9
const time = process.hrtime()

worker.on('message', msg => {
  console.log('msg: ', msg)
  const diff = process.hrtime(time)
  console.log(`Benchmark took ${diff[0] + diff[1] / NS_PER_SEC} seconds`)

  console.log('il', interval.length)
  interval.length && worker.postMessage(interval.pop())
  interval.length || worker.terminate()
})

worker.on('exit', param => {
  console.log('worker exits', param)
})
