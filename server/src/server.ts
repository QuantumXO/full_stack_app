import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rootRouter from '@routes/index';
import middlewares from '@middlewares/index';
import http from 'http';
import { unlessParams } from '@middlewares/jwt';
import '@configs/db';
import { createIoServer, onConnection } from '@configs/socket';
import { Server } from 'socket.io';

dotenv.config();

const { jwtMiddleware, errorsHandlerMiddleware, corsMiddleware } = middlewares;
export const app: Express = express();
const PORT = process.env.PORT || 3001;

export const httpServer: http.Server = http.createServer(app);
export const ioServer: Server = createIoServer();

const serverStart = async (): Promise<void> => {
  console.clear();
  try {
    // -- MIDDLEWARES
    app.use(corsMiddleware);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(jwtMiddleware.unless(unlessParams));
    app.use(rootRouter);
    app.use(errorsHandlerMiddleware);
    // -- MIDDLEWARES
    
    ioServer.on('connection', onConnection);
  
    httpServer.listen(PORT, (): void => console.log(`Server listening on ${PORT}`));
  } catch (e) {
    console.log('serverStart() e: ', e);
  }
};

serverStart();