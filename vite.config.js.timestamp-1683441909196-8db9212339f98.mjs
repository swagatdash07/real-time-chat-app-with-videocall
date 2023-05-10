// vite.config.js
import { defineConfig } from "file:///C:/Users/RKIT01/Desktop/vite%20chat-app/rechat-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/RKIT01/Desktop/vite%20chat-app/rechat-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy API requests to a different port or hostname
      "/api": "http://localhost:4001"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSS0lUMDFcXFxcRGVza3RvcFxcXFx2aXRlIGNoYXQtYXBwXFxcXHJlY2hhdC1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJLSVQwMVxcXFxEZXNrdG9wXFxcXHZpdGUgY2hhdC1hcHBcXFxccmVjaGF0LWFwcFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvUktJVDAxL0Rlc2t0b3Avdml0ZSUyMGNoYXQtYXBwL3JlY2hhdC1hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgLy8gcHJveHkgQVBJIHJlcXVlc3RzIHRvIGEgZGlmZmVyZW50IHBvcnQgb3IgaG9zdG5hbWVcbiAgICAgICcvYXBpJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMSdcbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdWLFNBQVMsb0JBQW9CO0FBQzdXLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
