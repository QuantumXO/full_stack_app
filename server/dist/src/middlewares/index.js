"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors_handler_1 = __importDefault(require("./errors-handler"));
var jwt_1 = __importDefault(require("./jwt"));
var cors_1 = __importDefault(require("./cors"));
exports.default = {
    errorsHandlerMiddleware: errors_handler_1.default,
    jwtMiddleware: jwt_1.default,
    corsMiddleware: cors_1.default,
};
