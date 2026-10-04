// PM2 process file. Fork mode by default: the in-memory form rate limiter is per process.
// Switch to cluster (instances: "max") only with NGINX limit_req as the authoritative limiter.
module.exports = {
  apps: [
    {
      name: "one-racecourse",
      cwd: "/var/www/one-racecourse/current",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "600M",
      env: { NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1" },
      out_file: "/var/log/one-racecourse/out.log",
      error_file: "/var/log/one-racecourse/error.log",
      merge_logs: true,
      time: true,
      kill_timeout: 8000,
      listen_timeout: 15000,
    },
  ],
};
