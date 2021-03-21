import { Connection, createConnection, getConnectionOptions } from 'typeorm';

const createConnetion = async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? './src/database/databaseTest.sqlite'
          : defaultOptions.database,
    }),
  );
};

export default createConnetion;
