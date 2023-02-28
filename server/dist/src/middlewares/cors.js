"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var originslist = [process.env.ALLOWED_ORIGIN];
var corsOptions = {
    origin: function (origin, callback) {
        if (originslist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    optionsSuccessStatus: 200 // For legacy browser support
};
var corsMiddleware = (0, cors_1.default)(corsOptions);
exports.default = corsMiddleware;
