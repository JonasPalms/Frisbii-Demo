import { defineConfig } from "vite"
import fs from "fs"

// Update this to match your GitHub repository name
// If deploying to root domain, use '/'
export default defineConfig({
  base: "/frisbii-demo/", // Change to your repo name or '/' for root
  build: {
    outDir: "dist",
  },
  server: {
    https: {
      key: fs.readFileSync("./localhost+2-key.pem"),
      cert: fs.readFileSync("./localhost+2.pem"),
    },
    port: 5173,
  },
})
