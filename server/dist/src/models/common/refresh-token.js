"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = exports.refreshTokenSchema = void 0;
var db_1 = __importDefault(require("../../configs/db"));
var Schema = db_1.default.Schema, model = db_1.default.model;
exports.refreshTokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    tokenId: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    }
});
exports.RefreshTokenModel = model('refresh-tokens', exports.refreshTokenSchema);
