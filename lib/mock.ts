import type { Connect } from 'vite'
import { isPromise } from './util'

import type {
  RequsetParams,
  MockOptions,
  MockRequest,
  MockCallback
} from './types'
import { ServerResponse } from 'http'

export const MockMap: Map<string, MockRequest & MockOptions> = new Map()

export default class Mock {
  private timeout = 0
  disabled = false
  constructor(options?: Pick<MockOptions, 'disabled' | 'timeout'>) {
    this.disabled = options?.disabled || false
    this.timeout = options?.timeout || 0
  }
  request(options: MockRequest & MockOptions) {
    if (this.disabled || options.disabled) return
    const key = options.method.toUpperCase() + ':' + options.url
    if (MockMap.get(key)) return
    MockMap.set(key, options)
  }
  get(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'GET',
      url,
      callback,
      ...options
    })
  }
  post(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'POST',
      url,
      callback,
      ...options
    })
  }
  put(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'PUT',
      url,
      callback,
      ...options
    })
  }
  delete(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'DELETE',
      url,
      callback,
      ...options
    })
  }
  head(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'HEAD',
      url,
      callback,
      ...options
    })
  }
  options(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'OPTIONS',
      url,
      callback,
      ...options
    })
  }
  trace(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'TRACE',
      url,
      callback,
      ...options
    })
  }
  patch(url: string, callback: MockCallback, options?: MockOptions) {
    this.request({
      method: 'PATCH',
      url,
      callback,
      ...options
    })
  }
  match(
    req: Connect.IncomingMessage & RequsetParams,
    res: ServerResponse,
    key: string
  ) {
    return new Promise(resolve => {
      const options = MockMap.get(key)
      if (this.disabled || !options) return resolve(undefined)
      const timeout = options.timeout || this.timeout || 0
      if (timeout > 0) {
        req.setTimeout(timeout, () => {
          resolve(undefined)
        })
      }
      const body = options.callback(req, res)
      if (isPromise(body)) {
        body.then(_body => {
          resolve({
            body: _body,
            ...options
          })
        })
      } else {
        resolve({
          body,
          ...options
        })
      }
    })
  }
}
