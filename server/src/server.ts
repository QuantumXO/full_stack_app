import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rootRouter from './routes';
import { corsMiddleware, errorsHandlerMiddleware, expressJwtMiddleware } from './middlewares';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import createIoServer from './configs/socket';

dotenv.config();

export const app: Express = express();
const PORT = process.env.PORT || 3001;

export const httpServer: http.Server = http.createServer(app);

const ioServer: Server = createIoServer();

const mockNotifications = [
  { id: '0', title: 'Title notification 0', body: 'Some text', isNew: true, createdAt: Date()},
  { id: '1', title: 'Title notification 1', body: 'Some text', createdAt: Date() },
];

const serverStart = async () => {
  try {
    // -- MIDDLEWARES
    app.use(corsMiddleware);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(expressJwtMiddleware);
    app.use(errorsHandlerMiddleware);
    app.use(rootRouter);
    // -- MIDDLEWARES
  
    ioServer.on('connection', (socket): void => {
      console.log(`⚡: ${socket.id} user just connected!`);
  
      socket.emit('notifications', { data: { notifications: mockNotifications } });
      
      socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
      });
    });
    
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