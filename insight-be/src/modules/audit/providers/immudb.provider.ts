// immudb.provider.ts

import Client from 'immudb-node';

export const immudbProvider = {
  provide: 'IMMUDB_CLIENT',
  useFactory: async () => {
    const client = new Client({
      host: process.env.IMMUDB_HOST!,
      port: Number(process.env.IMMUDB_PORT!),
      user: process.env.IMMUDB_USER!,
      password: process.env.IMMUDB_PASSWORD!,
    });
    await client.login({
      user: process.env.IMMUDB_USER!,
      password: process.env.IMMUDB_PASSWORD!,
    });
    return client;
  },
};
