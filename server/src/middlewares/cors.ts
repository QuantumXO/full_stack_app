import cors, { CorsOptions } from 'cors';
import { ALLOWED_ORIGINS } from '@src/constants';

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  optionsSuccessStatus: 200 // For legacy browser support
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;