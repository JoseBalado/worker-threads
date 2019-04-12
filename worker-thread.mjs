import { parentPort } from 'worker_threads'

const expensiveFunction = (start, end) => {
  const result = []
  for (let index = start; index <= end; index++) {
    if (index % 7 === 0) {
      result.push(index)
    }
  }

  for (let index = start; index <= end; index++) {
    if (index % 13 === 0) {
      result.push(index)
    }
  }

  for (let index = start; index <= end; index++) {
    if (index % 11 === 0) {
      result.push(index)
    }
  }

  parentPort.postMessage(result)
}

parentPort.on('message', param => {
  expensiveFunction(param.start, param.end)
})
