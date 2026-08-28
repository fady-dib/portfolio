import path from 'node:path'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|avif|gif|svg)$/

/**
 * Next resolves a static image import to a StaticImageData object; Vite
 * resolves it to a URL string. Without this, next/image throws "missing
 * required width property" in tests for markup that builds correctly.
 *
 * Dimensions are placeholders — no test asserts on them. What matters is
 * that the shape matches, so next/image renders instead of throwing and the
 * component under test is the real one.
 */
function staticImageData(): Plugin {
  return {
    name: 'static-image-data',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0]
      if (!IMAGE_EXTENSIONS.test(file)) return null

      const src = `/${path.relative(import.meta.dirname, file)}`
      return `export default ${JSON.stringify({
        src,
        width: 400,
        height: 400,
        blurDataURL: src,
        blurWidth: 8,
        blurHeight: 8,
      })}`
    },
  }
}

export default defineConfig({
  plugins: [tsconfigPaths(), react(), staticImageData()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
