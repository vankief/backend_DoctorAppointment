import { join } from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnection = async () => {
  const dbConfig: ConnectionOptions = {
    type: 'mysql',
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
    subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
    cli: {
      entitiesDir: 'src/entities',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  };

  await createConnection(dbConfig);
};
