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
