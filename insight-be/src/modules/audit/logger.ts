import pino from 'pino';

const transport = pino.transport({
  targets: [
    { target: 'pino/file', options: { destination: 1 } }, // Console/stdout
    {
      target: 'pino-elasticsearch',
      options: {
        index: 'nestjs-logs',
        node: process.env.ELASTICSEARCH_URL,
        esVersion: 7,
        flushBytes: 1000,
      },
    },
  ],
});

export const logger = pino({ level: 'info' }, transport);
