import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use '/' for Vercel deployment, '/OKUTAN/' for GitHub Pages
const base = process.env.VERCEL ? '/' : '/OKUTAN/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
})

