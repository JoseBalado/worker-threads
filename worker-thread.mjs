import { parentPort } from 'worker_threads'

const result = []

const expensiveFunction = (start, end) => {
  for (let index = start; index <= end; index++) {
    if (index % 7 === 0)
    result.push(index)
  }
}

parentPort.on('message', param => {
  console.log('params', param)
  expensiveFunction(param.start, param.end)
  parentPort.postMessage(result)
})
