// [main-app] Vite 配置
// 对应专栏：【第 5 篇 §5.5】开发环境的端口规划。
// 主应用固定 7100，两个子应用分别固定 7101 / 7102（见各自 package.json 的 serve 脚本），
// 避免与本地 mock 或其他服务抢占端口。
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 7100,
  },
})
