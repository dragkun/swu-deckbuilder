import _ from 'lodash'
import { createLogger, transports, format } from 'winston'
import 'winston-daily-rotate-file'

const dailyrotating = new transports.DailyRotateFile({
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: 14,
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.errors({ stack: true }),
    format.printf(
      (info) => {
        const meta = _.cloneDeep(info)
        delete meta.level
        delete meta.message
        delete meta.timestamp
        if (_.isEmpty(meta)) return `${info.timestamp} ${info.level}: ${info.message}`

        return `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(meta, null, 4)}`
      }
    )
  )
})

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    dailyrotating,
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        format.errors({ stack: true }),
        format.printf(
          (info) => {
            const meta = _.cloneDeep(info)
            delete meta.level
            delete meta.message
            delete meta.timestamp

            if (_.isEmpty(meta)) return `${info.timestamp} ${info.level}: ${info.message}`

            return `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(meta, null, 4)}`
          }
        )
      ),
      level: 'info'
    })
  ]
})

export default logger
