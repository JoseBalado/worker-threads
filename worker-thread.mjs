import { parentPort, workerData } from 'worker_threads'

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

generatePrimes(workerData.start, workerData.range)

parentPort.postMessage(primes)
