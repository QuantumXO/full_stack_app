import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

try {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.MONGO_DB_URI);
  
  mongoose.connection.on('connected', () => console.log('MongoDB connected.'));
  
  mongoose.connection.on('open', function (ref): void {
    //trying to get collection names
    /*mongoose.connection.db.listCollections().toArray(function (err, names) {
     console.log(names); // [{ name: 'dbname.myCollection' }]
     });*/
  });
  
  // If the connection throws an error
  mongoose.connection.on('error', (err): void => {
    console.log({ status: false, msg: 'handle mongo errored connections: ' + err }, 'service');
  });
  
  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log({ status: false, msg: 'Mongoose disconnected' }, 'service');
  });
} catch (error) {
  console.log({ status: false, msg: error }, 'service');
}