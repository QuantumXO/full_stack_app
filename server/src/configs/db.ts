import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createDBConnection = async (): Promise<void> => {
  try {
    await mongoose
      .set('strictQuery', false)
      .connect(process.env.MONGO_DB_URI);
  } catch (e) {
    console.log('DB connection e: ', e);
  }
};

createDBConnection();

export default mongoose;