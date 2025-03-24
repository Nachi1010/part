import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// הגדר את ה-base ל-'/' בשביל דומיין מותאם אישית
const base = '/';

export default defineConfig({
  base: base,
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
