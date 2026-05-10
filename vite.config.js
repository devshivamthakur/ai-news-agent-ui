import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyUrl = env.VITE_API_URL
  const baseUrl = mode === 'production' ? env.VITE_BASE_URL || '/ai-news-agent-ui/' : '/'

  return defineConfig({
    base: baseUrl,
    plugins: [react()],
    server: {
      port: 5173,
      ...(apiProxyUrl
        ? {
            proxy: {
              '/api': {
                target: apiProxyUrl,
                changeOrigin: true,
              },
            },
          }
        : {}),
    },
  })
}
