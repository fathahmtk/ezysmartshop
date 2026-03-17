import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const app = createApp();
const server = app.listen(env.port, () => {
  logger.info({ event: "server_started", port: env.port, environment: env.nodeEnv });
});

function shutdown(signal: string) {
  logger.info({ event: "server_shutdown_requested", signal });
  server.close((error) => {
    if (error) {
      logger.error({
        event: "server_shutdown_failed",
        signal,
        message: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

