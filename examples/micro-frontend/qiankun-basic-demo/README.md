# qiankun Basic Demo

这是第 5 篇《qiankun 深度解析（下）——实战与踩坑》的配套案例。

## 场景

- 主应用：`main-app`
- 子应用一：`subapp-dashboard`
- 子应用二：`subapp-order`
- 演示能力：`registerMicroApps`、`start`、生命周期导出、基于全局状态的简单通信

## 启动方式

```bash
npm install
npm run dev
```

启动后访问：

- 主应用：`http://localhost:7100`
- dashboard 子应用：`http://localhost:7101`
- order 子应用：`http://localhost:7102`

## 验证点

1. 打开主应用后会默认进入 `/dashboard`
2. 切换到 `/order` 时，主应用容器会卸载 dashboard 并挂载 order
3. 点击子应用里的按钮，可以看到主应用顶部“全局状态”区域发生变化
4. dashboard 子应用里有一个定时器，切换路由后会被清理，用来演示生命周期释放

## 代码 ↔ 专栏知识点对照

源码里的注释统一使用 `【第 N 篇 §x.y】` 锚点，读者看到任意代码块都能反查到对应专栏章节。

| 代码位置 | 专栏知识点 |
| --- | --- |
| [main-app/src/main.js](./main-app/src/main.js) | 《第 4 篇》§8 主应用注册、《第 5 篇》§三 标准接入 |
| └ `registerMicroApps` 各字段 | §6 HTML Entry（`entry`）、§3.3 路由劫持（`activeRule`）、§2 容器层（`container`） |
| └ `initGlobalState` / `onGlobalStateChange` / `setGlobalState` | §2 第 4 层「通信层」、§8 |
| └ `start({ prefetch: 'all' })` | §9 预加载机制 |
| └ `pushState` / `popstate` | §3.2 路由模式、§3.3 路由劫持 |
| └ `normalizeRoute` | 《第 5 篇》§2.3 路由基座、§5.1 路由冲突 |
| [subapp-dashboard/public/subapp.js](./subapp-dashboard/public/subapp.js) | 《第 5 篇》§2.1 / §2.2 子应用改造 |
| └ `bootstrap` / `mount` / `unmount` | 《第 4 篇》§7 生命周期 |
| └ `setInterval` + `clearInterval` | 《第 4 篇》§7、《第 5 篇》§5.4 生命周期未清理 |
| └ `window['subapp-dashboard']` | 《第 5 篇》§2.2 产物暴露成全局变量 |
| └ `__POWERED_BY_QIANKUN__` 分支 | 《第 5 篇》§2.1、§5.5 独立运行与联调 |
| [subapp-order/public/subapp.js](./subapp-order/public/subapp.js) | 同上；额外演示 `props` 传参与纯业务页 |
| [subapp-*/public/index.html](./subapp-dashboard/public/index.html) | 《第 4 篇》§6 HTML Entry 本体、《第 5 篇》§4.3 |
| [main-app/index.html](./main-app/index.html) | 《第 4 篇》§2 第 1 层「主应用容器层」 |
| [main-app/vite.config.js](./main-app/vite.config.js) | 《第 5 篇》§5.5 开发环境端口规划 |
| `subapp-*/package.json` 的 `serve --cors` | 《第 5 篇》§5.2 跨域、§5.5 |
| `main-app/src/style.css`、`subapp-*/public/subapp.css` | 《第 4 篇》§5 CSS 沙箱、《第 5 篇》§5.3 样式污染 |

每处注释都只是说明性文字，不改变任何运行逻辑；demo 的行为与第 5 篇 §4.2 的验证点严格一致。
