import { parentPort } from 'worker_threads'

const expensiveFunction = (id, start, end) => {
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

  parentPort.postMessage({ id: id, result: result })
}

parentPort.on('message', data => {
  expensiveFunction(data.id, data.interval.start, data.interval.end)
})
