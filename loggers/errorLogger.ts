import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const errorLogger = winston.createLogger({
  level: "error",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/logs.log" }),
  ],
});
export default errorLogger;
