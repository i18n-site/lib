export const LogLevel = {
  DEBUG: "debug",
  LOG: "log",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  OFF: "off",
};

const LOG_LEVEL_VALUES = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.LOG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.OFF]: 5,
};

export const createLogger = (log_obj = console, level = LogLevel.ERROR) => {
  let current_level = level;
  const 
    setLogLevel = (l) => { current_level = l; },
    isSupportedLogLevel = (v) => typeof v === "string" && Object.values(LogLevel).includes(v),
    isDebugEnabled = () => LOG_LEVEL_VALUES[current_level] <= LOG_LEVEL_VALUES[LogLevel.DEBUG],
    message = (lvl, msg, ...args) => {
      if (current_level !== LogLevel.OFF && LOG_LEVEL_VALUES[current_level] <= LOG_LEVEL_VALUES[lvl] && lvl !== LogLevel.OFF) {
        log_obj[lvl](msg, ...args);
      }
    };

  return {
    setLogLevel,
    isSupportedLogLevel,
    isDebugEnabled,
    debug: (msg, ...args) => message(LogLevel.DEBUG, msg, ...args),
    log: (msg, ...args) => message(LogLevel.LOG, msg, ...args),
    info: (msg, ...args) => message(LogLevel.INFO, msg, ...args),
    warn: (msg, ...args) => message(LogLevel.WARN, msg, ...args),
    error: (msg, ...args) => message(LogLevel.ERROR, msg, ...args),
  };
};

export const logger = createLogger();

if (process.env.NODE_ENV === "test") logger.setLogLevel(LogLevel.DEBUG);

let log_level = process.env.PRETTIER_PLUGIN_PUG_LOG_LEVEL;
if (log_level) {
  log_level = log_level.toLowerCase();
  if (logger.isSupportedLogLevel(log_level)) logger.setLogLevel(log_level);
}

export default { LogLevel, createLogger, logger };
