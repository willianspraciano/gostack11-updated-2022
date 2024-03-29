import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import { AppError } from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import { createDBConnection } from '@shared/infra/typeorm';
import '@shared/container';

createDBConnection()
  .then(() => {
    const app = express();
    const PORT = process.env.PORT || 3333;

    app.use(cors());
    app.use(express.json());
    app.use('/files', express.static(uploadConfig.uploadsFolder));
    app.use(rateLimiter);
    app.use(routes);

    app.use(errors());

    app.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
          });
        }

        console.error(err);

        return response.status(500).json({
          status: 'error',
          message: 'internal server error',
        });
      },
    );

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}!`);
    });
  })
  .catch(err => {
    console.log(`Could not connect to database: ${err}`);
  });
