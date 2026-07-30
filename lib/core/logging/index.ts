export type LogLevel = "debug" | "info" | "warn" | "error" | "audit";

export interface LogContext {
  readonly correlationId?: string;
  readonly actorId?: string;
  readonly component?: string;
  readonly operation?: string;
  readonly [key: string]: unknown;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  audit(message: string, context?: LogContext): void;
}

const write = (level: LogLevel, message: string, context?: LogContext): void => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ?? {}),
  };

  if (level === "error") {
    console.error(entry);
    return;
  }

  if (level === "warn") {
    console.warn(entry);
    return;
  }

  console.log(entry);
};

export const logger: Logger = {
  debug: (message, context) => write("debug", message, context),
  info: (message, context) => write("info", message, context),
  warn: (message, context) => write("warn", message, context),
  error: (message, context) => write("error", message, context),
  audit: (message, context) => write("audit", message, context),
};
