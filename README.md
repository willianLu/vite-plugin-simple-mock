# vite-plugin-simple-mock

[npm][npm-url] 地址

基于 TypeScript 开发的 [Vite] Server mock 服务。
支持 TypeScript 和 JavaScript 环境使用 Mock API。Mock Api 提供参数解析，包含 formData 数据解析，并支持 **_[express.js](https://github.com/expressjs/)_** middlewares.

## 安装

```bash
# 使用npm
npm i -D vite-plugin-simple-mock
# 使用yarn
yarn add -D vite-plugin-simple-mock
```

### 运行示例

```bash
npm install
cd ./example
npm install
npm run dev
```

### 用法

- 新建 mock 文件夹

```ts
// 目录 mock/index.ts
import { Mock } from "vite-plugin-simple-mock";

const mock = new Mock();

mock.get("/api/test", (req, res) => {
  return {
    code: 0,
    msg: "请求成功"
    data: {}
  }
})

return mock
```

- 在 vite.config.ts 中使用

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteSimpleMock from "vite-plugin-simple-mock";
// 导出的mock对象
import mock from "./mock/index";

export default defineConfig({
  plugins: [vue(), ViteSimpleMock(mock)],
});
```

#### mock 对象说明

- constructor

```ts
class Mock {
  constructor(options?: Pick<MockOptions, "disabled" | "timeout">) {}
}
```

| 参数     | 类型    | 必填项 | 说明               |
| -------- | ------- | ------ | ------------------ |
| disabled | boolean | 否     | 是否禁用 mock 对象 |
| timeout  | number  | 否     | 代理的超时时长     |

- request 代理请求方法
- get,post,put,delete,patch,options,head,trace 特定请求方式的代理

```ts
request(options: MockRequest & MockOptions) {}
get(url: string, callback: MockCallback, options?: MockOptions) {}
```

##### MockRequest 说明

| 参数     | 类型         | 必填项 | 说明               |
| -------- | ------------ | ------ | ------------------ |
| url      | string       | 是     | 代理的路径         |
| method   | string       | 是     | 代理请求方式       |
| callback | MockCallback | 是     | 代理请求的回调函数 |

##### MockCallback 说明

```ts
// req和res为http对象
// 函数内return值，即为返回值，
// 注：返回值必须为javascript有效值
export interface MockCallback {
  (req: Connect.IncomingMessage & RequsetParams, res: ServerResponse): any;
}
```

##### MockOptions 说明

| 参数       | 类型    | 必填项 | 说明               |
| ---------- | ------- | ------ | ------------------ |
| disabled   | boolean | 否     | 是否禁用 mock 对象 |
| timeout    | number  | 否     | 代理的超时时长     |
| statusCode | number  | 否     | 响应状态           |
| headers    | Object  | 否     | http 响应头        |

#### 插件说明

```ts
export default function VitePluginSimpleMock(
  mock: Mock,
  options?: PluginOptions
): PluginOption {}
```

| 参数    | 类型          | 必填项 | 说明       |
| ------- | ------------- | ------ | ---------- |
| mock    | Mock          | 是     | mock 对象  |
| options | PluginOptions | 否     | 插件配置项 |

##### PluginOptions 说明

| 参数               | 类型                                        | 必填项 | 说明                                             |
| ------------------ | ------------------------------------------- | ------ | ------------------------------------------------ |
| proxy              | string \/ RegExp \/ Array<string \/ RegExp> | 否     | 代理路径，默认: /^\/api\//                       |
| ignore             | string \/ RegExp \/ Array<string \/ RegExp> | 否     | 忽略代理路径                                     |
| disabled           | boolean                                     | 否     | 禁用插件                                         |
| middlewares        | Connect.NextHandleFunction[]                | 否     | express.js 中间件，主要用于参数处理              |
| disabledMiddleware | boolean                                     | 否     | 禁用插件集成的中间件，避免一些重复处理及不明错误 |

#### 特殊用法

```ts
// 目录 mock/index.ts
import { Mock } from "vite-plugin-simple-mock";

const mock = new Mock();

// 低优先级
mock.get("/api/test", (req, res) => {
  // 设置响应状态值
  res.statusCode = 210
  // 设置请求头
  res.setHeader("custom-type", "0_0");
  return {
    code: 0,
    msg: "请求成功"
    data: {
      query: req.query, // url链接参数
      body: req.body, // body参数
    }
  }
})
// 高优先级
mock.get("/api/top", (req, res) => {
  return {
    code: 0,
    msg: "请求成功"
    data: {
      query: req.query, // url链接参数
      body: req.body, // body参数
    }
  }
}, {
  // 配置项优先级最高
  statusCode: 210,
  headers: {
    "custom-type": "-0_0-"
  }
})

return mock
```

#### 注意事项

1. 插件只做基本的请求代理。
2. 插件注册多个相同代理，只会成功第一个

## License

MIT

[npm-url]: https://npmjs.com/package/vite-plugin-simple-mock
[Vite]: https://vitejs.dev
