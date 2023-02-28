"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = __importDefault(require("../controllers/auth"));
var authRouter = (0, express_1.Router)();
authRouter.route('/login').post(auth_1.default.login);
authRouter.route('/logout').post(auth_1.default.logOut);
authRouter.route('/sign-up').post(auth_1.default.signUp);
exports.default = authRouter;
