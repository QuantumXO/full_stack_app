import dotenv from 'dotenv';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import rootRouter from './routes';
import { corsMiddleware, errorsHandlerMiddleware, expressJwtMiddleware } from './middlewares';

dotenv.config();

mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGO_DB_URI)
  .then((res) => console.log('Connected to DB'))
  .catch(e => console.log('mongoose e: ', e));

export const app: Express = express();
const PORT = process.env.PORT || 3001;

// -- MIDDLEWARES
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressJwtMiddleware);
app.use(errorsHandlerMiddleware);
app.use(rootRouter);
// -- MIDDLEWARES

app.listen(PORT, (): void => {
  console.log(`Server listening on ${PORT}`);
});