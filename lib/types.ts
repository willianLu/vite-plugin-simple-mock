import type { ServerResponse } from 'http'
import type { Connect } from 'vite'

export type PluginOptions = {
  proxy?: string | RegExp | Array<string | RegExp>
  ignore?: string | RegExp | Array<string | RegExp>
  disabled?: boolean
  middlewares?: Connect.NextHandleFunction[]
  disabledMiddleware?: boolean
}

export type RequsetParams = {
  body?: Record<string, any>
  query?: Record<string, any>
  cookie?: Record<string, any>
}

export interface MockOptions {
  disabled?: boolean
  timeout?: number
  statusCode?: number
  headers?: Record<string, string>
}

export interface MockCallback {
  (req: Connect.IncomingMessage & RequsetParams, res: ServerResponse): any
}

export interface MockRequest {
  url: string
  method: string
  callback: MockCallback
}
