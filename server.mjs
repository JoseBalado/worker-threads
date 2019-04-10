import { Worker } from 'worker_threads'

const worker = new Worker('./worker-thread.mjs')

worker.on('message', msg => console.log(msg))
