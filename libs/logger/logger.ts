import pino from 'pino'

const logger = pino({
  name: 'badstu',
  transport: {
    target: 'pino-pretty',
  },
})

export default logger
