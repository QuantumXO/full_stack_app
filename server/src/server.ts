import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rootRouter from './routes';
import { corsMiddleware, errorsHandlerMiddleware, expressJwtMiddleware } from './middlewares';
import mongoose from 'mongoose';

dotenv.config();

export const app: Express = express();
const PORT = process.env.PORT || 3001;

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
  
    mongoose.connection.on('open', function (ref) {
      console.log('MongoDB connected.');
      //trying to get collection names
      /*mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
      });*/
    })
    
    app.listen(PORT, (): void => {
      console.log(`Server listening on ${PORT}`);
    });
  } catch (e) {
    console.log('serverStart() e: ', e);
  }
};

serverStart();