import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const createDBConnection = async () => {
  try {
    await mongoose
      .set('strictQuery', false)
      .connect(process.env.MONGO_DB_URI);
  } catch (e) {
    console.log('mongoose e: ', e);
  }
};

createDBConnection();

export default mongoose;