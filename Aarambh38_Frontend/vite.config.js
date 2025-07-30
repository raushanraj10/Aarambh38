import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // 👈 this is essential for correct asset loading
  plugins: [react()],
})
