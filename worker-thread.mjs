import { Worker, isMainThread, parentPort } from 'worker_threads'

parentPort.postMessage('Hello world!')
