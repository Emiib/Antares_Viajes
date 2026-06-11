import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// Hemos eliminado el import de viteSingleFile

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()], // Eliminado viteSingleFile de aquí
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Mantenemos esto para que los imports con @ sigan funcionando
    },
  },
});
