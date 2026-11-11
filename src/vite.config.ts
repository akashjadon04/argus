import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, Plugin } from "vite";
const pkg = require("./package.json");

function mockApiPlugin(): Plugin {
  return {
    name: "mock-api-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api")) return next();
        const url = req.url.replace("/api", "").split("?")[0];
        res.setHeader("Content-Type", "application/json");

        if (url === "/_auth/me") {
          return res.end(
            JSON.stringify({
              id: "usr_akash",
              name: "Akash Jadon",
              email: "akash@jadon.dev",
              avatarUrl: "https://github.com/akashjadon04.png",
            })
          );
        }
        if (url === "/_auth/providers") {
          return res.end(JSON.stringify({ github: true, google: false }));
        }
        if (url === "/_apps") {
          return res.end(
            JSON.stringify([
              {
                id: "app_argus_live",
                name: "Argus Production Telemetry",
                appKey: "A-EU-9823419082",
                iconPath: "/argus-logo.svg",
                hasEvents: true,
                hasOwnership: true,
              },
            ])
          );
        }
        if (url.startsWith("/_apps/app_argus_live/shares")) {
          return res.end(JSON.stringify({ isShared: false }));
        }
        if (url.startsWith("/_apps/")) {
          return res.end(
            JSON.stringify({
              id: "app_argus_live",
              name: "Argus Production Telemetry",
              appKey: "A-EU-9823419082",
              iconPath: "/argus-logo.svg",
              hasEvents: true,
              hasOwnership: true,
            })
          );
        }
        if (url === "/_app-requests") {
          return res.end(JSON.stringify([]));
        }
        if (url === "/_stats/metrics") {
          return res.end(
            JSON.stringify({
              current: { dailyUsers: 1420, sessions: 4890, events: 38400, durationSeconds: 185 },
              previous: { dailyUsers: 1210, sessions: 4120, events: 32100, durationSeconds: 170 },
            })
          );
        }
        if (url === "/_stats/periodic") {
          return res.end(
            JSON.stringify([
              { period: "2026-11-05", users: 1100, sessions: 3900, events: 29000 },
              { period: "2026-11-06", users: 1250, sessions: 4200, events: 31500 },
              { period: "2026-11-07", users: 1180, sessions: 4050, events: 30200 },
              { period: "2026-11-08", users: 1340, sessions: 4500, events: 34000 },
              { period: "2026-11-09", users: 1400, sessions: 4700, events: 36000 },
              { period: "2026-11-10", users: 1390, sessions: 4650, events: 35800 },
              { period: "2026-11-11", users: 1420, sessions: 4890, events: 38400 },
            ])
          );
        }
        if (url === "/_stats/top-countries") {
          return res.end(
            JSON.stringify([
              { name: "United States", value: 45 },
              { name: "India", value: 28 },
              { name: "Germany", value: 15 },
              { name: "United Kingdom", value: 12 },
            ])
          );
        }
        if (url === "/_stats/top-operatingsystems") {
          return res.end(
            JSON.stringify([
              { name: "macOS", value: 52 },
              { name: "Windows", value: 31 },
              { name: "iOS", value: 11 },
              { name: "Android", value: 6 },
            ])
          );
        }
        if (url === "/_stats/top-events") {
          return res.end(
            JSON.stringify([
              { name: "session_start", value: 4890 },
              { name: "workflow_executed", value: 3120 },
              { name: "export_data", value: 940 },
              { name: "api_call", value: 18200 },
            ])
          );
        }
        if (url === "/_stats/top-appversions") {
          return res.end(
            JSON.stringify([
              { name: "2.88.0", value: 85 },
              { name: "2.87.1", value: 15 },
            ])
          );
        }
        if (url === "/_stats/top-osversions") {
          return res.end(
            JSON.stringify([
              { name: "15.1.0", value: 60 },
              { name: "14.6.0", value: 40 },
            ])
          );
        }
        if (url === "/_stats/live-sessions" || url === "/_stats/historical-sessions") {
          return res.end(
            JSON.stringify([
              {
                id: "sess_1",
                userId: "usr_akash",
                durationSeconds: 142,
                ip: "127.0.0.1",
                country: "US",
                osName: "macOS",
                osVersion: "15.1",
                appVersion: "2.88.0",
                startedAt: new Date().toISOString(),
              },
            ])
          );
        }
        if (url === "/_stats/live-geo" || url === "/_stats/top-props") {
          return res.end(JSON.stringify([]));
        }

        res.end(JSON.stringify({}));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mockApiPlugin()],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(pkg.version),
  },
  publicDir: "webapp/public",
  build: {
    outDir: "wwwroot",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-router-dom", "react-dom"],
          chartjs: ["chart.js", "chartjs-plugin-annotation"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3002,
    https: false,
    headers: {
      "Content-Security-Policy": `default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' ; font-src 'self' https: data:; connect-src 'self' ws: wss: https:;`,
    },
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: [
      {
        find: "@components",
        replacement: path.resolve(__dirname, "./webapp/components"),
      },
      {
        find: "@fns",
        replacement: path.resolve(__dirname, "./webapp/fns"),
      },
      {
        find: "@hooks",
        replacement: path.resolve(__dirname, "./webapp/hooks"),
      },
      {
        find: "@features",
        replacement: path.resolve(__dirname, "./webapp/features"),
      },
    ],
  },
});
