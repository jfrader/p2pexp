import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config.ts'

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      outDir: new URL('../renderer', import.meta.url).pathname,
    },
  }),
)
