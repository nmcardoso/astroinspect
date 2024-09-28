import Emitter from "./Emitter"

class Semaphore {
  currentRequests: {
    resolve: (value: unknown) => void,
    reject: (value: unknown) => void,
    fnToCall: (...args: any) => Promise<any>,
    args: any
  }[]
  runningRequests: number
  maxConcurrentRequests: number

  /**
   * Creates a semaphore that limits the number of concurrent Promises being handled
   * @param {*} maxConcurrentRequests max number of concurrent promises being handled at any time
   */
  constructor(maxConcurrentRequests = 1) {
    this.currentRequests = []
    this.runningRequests = 0
    this.maxConcurrentRequests = maxConcurrentRequests
  }

  /**
   * Returns a Promise that will eventually return the result of the function passed in
   * Use this to limit the number of concurrent function executions
   * @param {*} fnToCall function that has a cap on the number of concurrent executions
   * @param  {...any} args any arguments to be passed to fnToCall
   * @returns Promise that will resolve with the resolved value as if the function passed in was directly called
   */
  callFunction(fnToCall: (...args: any) => Promise<any>, ...args: any[]) {
    return new Promise((resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        fnToCall,
        args,
      })
      Emitter.on('cancel', () => {
        console.log('cancelling')
        reject('cancelled')
      })
      this.tryNext()
    })
  }

  tryNext() {
    if (this.runningRequests < this.maxConcurrentRequests) {
      const curr = this.currentRequests.shift()
      if (curr) {
        this.runningRequests++
        const args = curr.args
        let req = curr.fnToCall.apply(null, args)
        req.then((res) => curr.resolve(res))
          .catch((err) => curr.reject(err))
          .finally(() => {
            this.runningRequests--
            this.tryNext()
          })
      }

    }
  }

  clear() {
    this.currentRequests = []
  }
}



class SemaphorePool {
  pool: { [key: string]: Semaphore }
  controller: AbortController

  constructor() {
    this.pool = {}
    this.controller = new AbortController()
  }

  create(id: number | string, maxConcurrency: number = 5) {
    if (!(id in this.pool)) {
      this.pool[id] = new Semaphore(maxConcurrency)
    }
  }

  enqueue(
    id: number | string,
    factory: (...args: any) => Promise<any>,
    ...args: any[]
  ): Promise<any> {
    return this.pool[id].callFunction(factory, ...args)
  }

  getSignal() {
    return this.controller.signal
  }

  clear(id?: number | string) {
    if (!!id) {
      this.pool[id].clear()
    } else {
      for (const k in this.pool) {
        this.pool[k].clear()
      }
    }
  }
}

export const semaphore = new SemaphorePool()