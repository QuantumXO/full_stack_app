"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var constants_1 = require("../constants");
dotenv_1.default.config();
var HttpException = /** @class */ (function (_super) {
    __extends(HttpException, _super);
    function HttpException(status, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.message = message;
        return _this;
    }
    return HttpException;
}(Error));
function errorsHandlerMiddleware(err, req, res, next) {
    if (err) {
        var name_1 = err.name, message = err.message;
        if (name_1 === 'UnauthorizedError') {
            res
                .clearCookie(constants_1.ACCESS_TOKEN_NAME)
                .clearCookie(constants_1.REFRESH_TOKEN_NAME)
                .status(401)
                .json({ errorName: name_1, message: 'Invalid token...' })
                .end();
        }
        else {
            res
                .status(500)
                .json({ errorName: name_1, message: message || 'Some error from server...' })
                .end();
        }
    }
    else {
        next();
    }
}
exports.default = errorsHandlerMiddleware;
