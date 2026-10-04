// PM2 process file. Reads secrets from shared/.env.production at (re)load time.
const fs = require("fs");
const path = require("path");

const APP_DIR = process.env.APP_DIR || "/var/www/one-racecourse";
const envFile = path.join(APP_DIR, "shared/.env.production");

function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    out[m[1]] = v;
  }
  return out;
}

module.exports = {
  apps: [
    {
      name: "one-racecourse",
      cwd: path.join(APP_DIR, "current/.next/standalone"),
      script: "server.js",
      exec_mode: "fork", // in-memory form rate limiter is per process; NGINX limit_req is the edge limit
      instances: 1,
      max_memory_restart: "700M",
      env: {
        ...parseEnv(envFile),
        NODE_ENV: "production",
        PORT: process.env.PORT || "3000",
        HOSTNAME: "127.0.0.1", // never exposed publicly; NGINX proxies to it
        NEXT_TELEMETRY_DISABLED: "1",
      },
      out_file: path.join(APP_DIR, "logs/out.log"),
      error_file: path.join(APP_DIR, "logs/error.log"),
      merge_logs: true,
      time: true,
      kill_timeout: 8000,
    },
  ],
};
