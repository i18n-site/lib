/** Log levels. */
export var LogLevel;
(function (LogLevel) {
  LogLevel["DEBUG"] = "debug";
  LogLevel["LOG"] = "log";
  LogLevel["INFO"] = "info";
  LogLevel["WARN"] = "warn";
  LogLevel["ERROR"] = "error";
  LogLevel["OFF"] = "off";
})(LogLevel || (LogLevel = {}));

const LOG_LEVEL_VALUES = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.LOG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.OFF]: 5,
};

/** The logger class. */
export class Logger {
  logger;
  level;
  /**
   * Constructs a new logger.
   *
   * @param logger The wrapped logger that will be used for printing messages. Default: `console`.
   * @param level The log level. Default: `'error'`.
   */
  constructor(logger = console, level = LogLevel.ERROR) {
    this.logger = logger;
    this.level = level;
  }
  /**
   * Checks if the given value is a supported log level.
   *
   * @param value The value to check.
   * @returns `true` if the given value is a supported log level, otherwise `false`.
   */
  static isSupportedLogLevel(value) {
    return (
      typeof value === "string" &&
      (value === "debug" ||
        value === "log" ||
        value === "info" ||
        value === "warn" ||
        value === "error" ||
        value === "off")
    );
  }
  /**
   * Set the log level to the given level.
   *
   * @param level The new log level.
   */
  setLogLevel(level) {
    this.level = level;
  }
  /**
   * Whether debugging is enabled or not.
   *
   * @returns `true` if debug level is enabled, otherwise `false`.
   */
  isDebugEnabled() {
    return LOG_LEVEL_VALUES[this.level] <= LOG_LEVEL_VALUES[LogLevel.DEBUG];
  }
  /**
   * Prints the given message as a debug log entry.
   *
   * @param message The message to print.
   * @param optionalParams Optional arguments.
   */
  debug(message, ...optionalParams) {
    this.message(LogLevel.DEBUG, message, ...optionalParams);
  }
  /**
   * Prints the given message as a log entry.
   *
   * @param message The message to print.
   * @param optionalParams Optional arguments.
   */
  log(message, ...optionalParams) {
    this.message(LogLevel.LOG, message, ...optionalParams);
  }
  /**
   * Prints the given message as a info log entry.
   *
   * @param message The message to print.
   * @param optionalParams Optional arguments.
   */
  info(message, ...optionalParams) {
    this.message(LogLevel.INFO, message, ...optionalParams);
  }
  /**
   * Prints the given message as a warn log entry.
   *
   * @param message The message to print.
   * @param optionalParams Optional arguments.
   */
  warn(message, ...optionalParams) {
    this.message(LogLevel.WARN, message, ...optionalParams);
  }
  /**
   * Prints the given message as a error log entry.
   *
   * @param message The message to print.
   * @param optionalParams Optional arguments.
   */
  error(message, ...optionalParams) {
    this.message(LogLevel.ERROR, message, ...optionalParams);
  }
  message(level, message, ...optionalParams) {
    if (
      this.level !== LogLevel.OFF &&
      LOG_LEVEL_VALUES[this.level] <= LOG_LEVEL_VALUES[level] &&
      level !== LogLevel.OFF
    ) {
      this.logger[level](message, ...optionalParams);
    }
  }
}
/**
 * Constructs a new logger.
 *
 * @param logger The wrapped logger that will be used for printing messages. Default: console.
 * @returns A newly constructed logger.
 */
export function createLogger(logger = console) {
  return new Logger(logger);
}
/**
 * Logger for \@prettier/plugin-pug.
 */
export const logger = createLogger(console);
// Configure the logger based on the environment.
if (process.env.NODE_ENV === "test") {
  logger.setLogLevel(LogLevel.DEBUG);
}
let logLevel = process.env.PRETTIER_PLUGIN_PUG_LOG_LEVEL;
if (logLevel) {
  logLevel = logLevel.toLowerCase();
  if (Logger.isSupportedLogLevel(logLevel)) {
    logger.setLogLevel(logLevel);
  }
}
