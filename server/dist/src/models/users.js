"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = void 0;
var db_1 = __importDefault(require("../configs/db"));
var Schema = db_1.default.Schema, model = db_1.default.model;
exports.userSchema = new Schema({
    _id: {
        type: Number,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 255,
        minLength: 2,
    },
    location: {
        type: String,
        maxLength: 255,
        minLength: 2,
    },
    password: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
    },
});
exports.UserModel = model('users', exports.userSchema);
