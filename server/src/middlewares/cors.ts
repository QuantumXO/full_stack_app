import cors, { CorsOptions } from 'cors';

const originslist: string[] = [process.env.ALLOWED_ORIGIN];
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if (originslist.indexOf(origin) !== -1) {
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