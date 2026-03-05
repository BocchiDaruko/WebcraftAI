import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy para la API de Anthropic en desarrollo
      // Evita exponer la API key en el frontend
      "/api/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
        headers: {
          "anthropic-version": "2023-06-01",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        },
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
  define: {
    // Expone solo variables VITE_ al cliente
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
