import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
        open: true,
        port: parseInt(process.env.PORT || '5173'),
    },
    build: {
        chunkSizeWarningLimit: 2000, // in kilobytes
    },
});
