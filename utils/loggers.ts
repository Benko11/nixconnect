import winston from "winston";

export const dbErrorLogger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File()],
});
