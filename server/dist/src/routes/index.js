"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = __importDefault(require("./auth"));
var test_1 = __importDefault(require("./test"));
var rootRouter = (0, express_1.Router)();
rootRouter.use(auth_1.default);
rootRouter.use(test_1.default);
exports.default = rootRouter;
