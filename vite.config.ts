import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";

const isContainer = fs.existsSync("/.dockerenv") || fs.existsSync("/run/secrets/kubernetes.io");
const defaultPort = isContainer ? 443 : undefined;
const hmrClientPort = process.env.HMR_CLIENT_PORT
  ? Number(process.env.HMR_CLIENT_PORT)
  : defaultPort;

export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "react-router"],
    alias: [
      {
        find: /^@qb\/(.+)$/,
        replacement: fileURLToPath(new URL("./app/modules/$1", import.meta.url)),
      },
    ],
  },
  optimizeDeps: {
    // Pre-bundle commonly-used client deps so Vite doesn't discover them
    // mid-session and trigger a full-page reload. Without this, the dev server
    // optimizes these on first request and forces a reload, which (with polling
    // + HMR) can cascade into a continuous reload loop that leaves the preview
    // iframe blank.
    include: [
      "next-themes",
      "lucide-react",
      "clsx",
      "tailwind-merge",
      "axios",
    ],
  },
  ssr: {
    noExternal: [
      // "@radix-ui",
      // "react-icons",
      // "framer-motion",
      // "@apollo/client",
      // "posthog-js",
      // "posthog-js/react",
    ],
  },
  server: {
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: hmrClientPort ? { clientPort: hmrClientPort } : true,
  },
  plugins: [
    devtoolsJson(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
