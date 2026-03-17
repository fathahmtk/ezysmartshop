type LogLevel = "debug" | "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function write(level: LogLevel, payload: LogPayload) {
  const line = JSON.stringify({
    level,
    timestamp: new Date().toISOString(),
    ...payload
  });

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug(payload: LogPayload) {
    write("debug", payload);
  },
  info(payload: LogPayload) {
    write("info", payload);
  },
  warn(payload: LogPayload) {
    write("warn", payload);
  },
  error(payload: LogPayload) {
    write("error", payload);
  }
};
