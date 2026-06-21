import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (jasoncarlson.org) is served from the site root, so base is '/'.
// If this were ever served from https://<user>.github.io/<repo>/ instead,
// set base to '/personal-research-website/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
