import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import version from 'vite-plugin-package-version';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), version()],
  define: {
    'import.meta.env.VITE_APP_BUILD_TIME': JSON.stringify(new Date().toISOString()),
  },
});