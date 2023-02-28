import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rootRouter from '@routes/index';
import middlewares from '@middlewares/index';
import mongoose from 'mongoose';
import http from 'http';
import { Server, Socket } from 'socket.io';
import createIoServer from '@configs/socket';
import { unlessParams } from '@middlewares/jwt';
import { registerNotificationsHandlers } from '@controllers/notifications';

dotenv.config();

console.clear();

const { jwtMiddleware, errorsHandlerMiddleware, corsMiddleware } = middlewares;
export const app: Express = express();
const PORT = process.env.PORT || 3001;

export const httpServer: http.Server = http.createServer(app);

export const ioServer: Server = createIoServer();

function onConnection(socket: Socket): void {
  console.log(`⚡: ${socket.id} user just connected!`);
  
  socket.emit('connection:sid', socket.id);
  
  registerNotificationsHandlers(ioServer, socket);
  
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
}

const serverStart = async () => {
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
    
    // app.get('/socket.io');

    mongoose.connection.on('open', function (ref): void {
      console.log('MongoDB connected.');
      //trying to get collection names
      /*mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
      });*/
    })
  
    httpServer.listen(PORT, (): void => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (e) {
    console.log('serverStart() e: ', e);
  }
};

serverStart();