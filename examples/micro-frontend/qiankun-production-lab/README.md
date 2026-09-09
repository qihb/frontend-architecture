# qiankun Production Lab

这是番外篇《企业级混合微前端改造实战》的配套实验室。

## 包含两组案例

### 1. 生产改造实验室

- `shell-app`：主应用壳
- `legacy-crm-vue2`：模拟老旧 Vue2/Webpack 子应用
- `approval-react`：模拟 React/Webpack 子应用
- `customer-widget`：局部嵌入子应用，配合 `loadMicroApp` 演示
- `analytics-vue3`：Vue3/Vite 子应用，默认独立启动，用来说明 qiankun 2.x 下的现代工程适配成本

启动：

```bash
npm install
npm run dev:portal
```

访问：

- 主应用：`http://localhost:7200`
- CRM 子应用：`http://localhost:7201`
- Approval 子应用：`http://localhost:7202`
- Widget 子应用：`http://localhost:7203`

可选启动 analytics：

```bash
npm run dev:analytics
```

访问：`http://localhost:7204`

### 2. qiankun 3 ESM 试验台

- `qiankun3-lab/host-app`
- `qiankun3-lab/esm-app`

启动：

```bash
npm install
npm run dev:qiankun3
```

访问：

- qiankun 3 host：`http://localhost:7300`
- ESM 子应用：`http://localhost:7301`

打开 `http://localhost:7300`，如果 esm-app 被挂载，Console 应出现 `[esm-app] bootstrap` 与 `[esm-app] mount` 日志。

**实验记录（rc.22 实测）：** qiankun 3 rc 的 `registerMicroApps` 中 `container` 需要传已经解析好的 DOM 元素（如 `document.querySelector('#esm-stage')`），不再像 2.x 那样接受字符串选择器，否则会在加载阶段抛 `Invalid value used as weak map key`。rc 版本的 API 仍在演进，接入前建议先做一次最小冒烟验证。

## 建议阅读顺序

1. 先看第 5 篇正文，对照 `qiankun-basic-demo`
2. 再看这组 production lab，理解为什么真实项目不会只有“主应用 + 两个子应用切路由”这么简单
3. 最后看 `qiankun3-lab`，把它当成新版本能力验证，而不是马上投入生产的标准答案
