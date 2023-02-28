"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var test_1 = __importDefault(require("../controllers/test"));
var testRouter = (0, express_1.Router)();
testRouter.route('/api').get(test_1.default.api);
exports.default = testRouter;
