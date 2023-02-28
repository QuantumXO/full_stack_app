"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = exports.notificationSchema = void 0;
var db_1 = __importDefault(require("../../configs/db"));
var Schema = db_1.default.Schema, model = db_1.default.model;
exports.notificationSchema = new Schema({});
exports.NotificationModel = model('notifications', exports.notificationSchema);
