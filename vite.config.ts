import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        index: path.resolve(
          __dirname,
          "index.html"
        ),
        html2go: path.resolve(
          __dirname,
          "public/html2go.html"
        ),
        idbTest: path.resolve(
          __dirname,
          "public/idbTest.html"
        ),
      },
    },
  }
});
