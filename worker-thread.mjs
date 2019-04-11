import { parentPort } from 'worker_threads'

const primes = []

const generatePrimes = (start, range) => {
  let isPrime = true
  const min = start || 2
  const end = start + range
  for (let i = start; i < end; i++) {
    for (let j = min; j < Math.sqrt(end); j++) {
      if (i !== j && i % j === 0) {
        isPrime = false
        break
      }
    }
    if (isPrime) {
      primes.push(i)
    }
    isPrime = true
  }
}

parentPort.on('message', param => {
  generatePrimes(param.start, param.range)
  parentPort.postMessage(primes)
})
