import pino from 'pino'

const logger = pino({
  name: 'badstu',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
        }
      : undefined,
})

export default logger
