import winston from "winston";
import 'winston-daily-rotate-file'
import dotenv from 'dotenv';

dotenv.config();

const tranport=new winston.transports.DailyRotateFile({
  filename:'./logs/app-%DATE%.log',
  datePattern:'YYYY-MM-DD',
  zippedArchive:true,
  maxSize:process.env.MAXSIZE,
  maxFiles:process.env.INFO_MAXFILES,
  level:'info'
})
//エラーログ
const errortransport=new winston.transports.DailyRotateFile({
filename:'./logs/error-%DATE%.log',
datePattern:'YYYY-MM-DD',
zippedArchive:true,
maxSize:process.env.MAXSIZE,
maxFiles:process.env.ERROR_MAXFILES,
level:'error'

})
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    }),
    winston.format.printf((
      ({ level, message, timestamp }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
      })
    )
  ),
  transports: [
    tranport,errortransport
  ]
})
export default logger;