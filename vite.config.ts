import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  
  // Servidor de desarrollo
  server: {
    port: 5173,
    host: false
  },
  
  // Build para producción
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desactivar sourcemaps en producción
    minify: 'terser', // Minificar código
    
    rollupOptions: {
      output: {
        // Optimizar nombres de archivos para cache
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  
  // Configuración base para despliegue en subdirectorio (si es necesario)
  base: './' // Relativo para funcionar en cualquier ruta
})
// vite.config.ts
console.log('Usando vite.config.ts');