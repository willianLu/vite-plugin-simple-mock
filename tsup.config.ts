import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts'],
  format: ['cjs', 'esm'],
  minify: true,
  dts: true,
  splitting: false,
  clean: true,
  esbuildOptions(options, context) {
    options.drop = ['console', 'debugger']
  }
})
