import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: process.env.GITHUB_ACTIONS ? '/MATAB21-atividade-final/' : '/',
  build: {
    outDir: 'dist',
  },
  test: {
    include: ['**/*.test.js'],
  },
})
