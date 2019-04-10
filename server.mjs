import { Worker, isMainThread, parentPort } from 'worker_threads'

const worker = new Worker('./worker-thread.mjs')

worker.on('message', msg => console.log(msg))
