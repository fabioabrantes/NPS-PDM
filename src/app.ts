import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
// tem que ser logo abaixo da nossa importação do express
import { AppError } from './errors/AppError';
import { router } from './routes';

import createConnetion from './database';

createConnetion();

const app = express();
app.use(express.json());

app.use(router);
app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'Error',
      message: `Internal server error ${err.message}`,
    });
  },
);

export { app };
