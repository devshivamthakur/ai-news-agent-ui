import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyUrl = env.VITE_API_URL

  return defineConfig({
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
