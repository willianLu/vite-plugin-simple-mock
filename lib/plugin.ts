import type { PluginOption, Connect } from 'vite'
import Mock, { MockMap } from './mock'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import URL from 'url'
import type { PluginOptions, RequsetParams } from './types'
import { type ServerResponse } from 'http'

function formDataParser(
  req: Connect.IncomingMessage & RequsetParams,
  res: ServerResponse,
  next: () => void
) {
  const contentType = req.headers['content-type'] || ''
  if (!/multipart\/form-data/.test(contentType)) {
    return next()
  }
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })
  req.on('end', () => {
    const boundary = contentType.replace(/^multipart\/form-data; boundary=/, '')
    let key = ''
    const data: Record<string, string> = {}
    body.split('\r\n').forEach(item => {
      if (!item || item.indexOf(boundary) > -1) return
      if (item.indexOf('Content-Disposition: form-data; name="') > -1) {
        key = item.replace(
          /^Content-Disposition: form-data; name="(.*)"$/g,
          '$1'
        )
      } else {
        try {
          data[key] = JSON.parse(item)
        } catch (error) {
          data[key] = item
        }
      }
    })
    req.body = data
    next()
  })
}
function handleMiddlewareRun(
  middlewares: Connect.NextHandleFunction[],
  req: Connect.IncomingMessage & RequsetParams,
  res: ServerResponse,
  callback: () => void
) {
  if (middlewares.length === 0) {
    return callback()
  }
  const exec = middlewares.shift()
  exec &&
    exec(req, res, () => {
      handleMiddlewareRun(middlewares, req, res, callback)
    })
}
export default function VitePluginSimpleMock(
  mock: Mock,
  options?: PluginOptions
): PluginOption {
  return {
    name: 'vite-plugin-simple-mock',
    enforce: 'pre',
    apply: 'serve',
    configureServer(server) {
      if (options?.disabled) return
      server.middlewares.use(
        (req: Connect.IncomingMessage & RequsetParams, res, next) => {
          const url = req.url?.split('?')[0] || ''
          let ignore = options?.ignore || []
          ignore = Array.isArray(ignore) ? ignore : [ignore]

          // mock对象被禁用 或者 忽略的请求
          if (
            mock.disabled ||
            ignore.some(item => new RegExp(item).test(url))
          ) {
            return next()
          }
          let proxyArr = options?.proxy || /^\/api/
          proxyArr = Array.isArray(proxyArr) ? proxyArr : [proxyArr]
          const key = req.method?.toUpperCase() + ':' + url
          // 未注册mock方法 或 未满足mock代理的请求
          if (
            !MockMap.get(key) ||
            !proxyArr.some(proxy => new RegExp(proxy).test(url))
          ) {
            return next()
          }
          // 解析请求url参数
          req.query = URL.parse(req.url || '', true).query

          // 合并中间件
          let middlewares: Connect.NextHandleFunction[] = []
          if (options?.disabledMiddleware !== true) {
            middlewares = [
              cookieParser(),
              bodyParser.json(),
              bodyParser.urlencoded({
                extended: true
              }),
              bodyParser.text(),
              bodyParser.raw(),
              formDataParser
            ]
          }
          if (options?.middlewares?.length) {
            middlewares = middlewares.concat(options.middlewares)
          }
          console.log(url, '=======代理')
          // 对代理的请求进行中间件处理
          handleMiddlewareRun(middlewares, req, res, async () => {
            // 设置默认content-type
            res.setHeader('Content-Type', 'application/json')
            const _res: any = await mock.match(req, res, key)
            if (_res) {
              const body = Buffer.from(JSON.stringify(_res.body || ''))
              const _headers = _res.headers || {}
              // 处理完成时, 设置头部信息
              res.writeHead(_res.statusCode || res.statusCode, {
                'Content-Length': Buffer.byteLength(body),
                ..._headers
              })
              res.end(body)
              return
            }
            next()
          })
        }
      )
    }
  }
}
