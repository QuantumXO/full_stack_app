"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var uuid_1 = require("uuid");
var refresh_token_1 = require("../models/common/refresh-token");
var constants_1 = require("../constants");
var accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE);
var refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE);
var Token = /** @class */ (function () {
    function Token(_a) {
        var userId = _a.userId;
        this.userId = userId;
    }
    Token.prototype.throwUserIdError = function () {
        if (!this.userId) {
            throw new Error('this.userId not found');
        }
    };
    Object.defineProperty(Token.prototype, "getNewAccessToken", {
        get: function () {
            this.throwUserIdError();
            var token = jsonwebtoken_1.default.sign({
                userId: this.userId,
                type: constants_1.ACCESS_TOKEN_NAME,
            }, process.env.TOKEN_SECRET, {
                algorithm: process.env.TOKEN_ALGORITHM,
                expiresIn: process.env.ACCESS_TOKEN_MAX_AGE
            });
            return {
                token: token,
                userId: this.userId,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Token.prototype, "getNewRefreshToken", {
        get: function () {
            var tokenId = (0, uuid_1.v4)();
            var token = jsonwebtoken_1.default.sign({
                id: tokenId,
                type: constants_1.REFRESH_TOKEN_NAME,
            }, process.env.TOKEN_SECRET, {
                algorithm: process.env.TOKEN_ALGORITHM,
                expiresIn: process.env.REFRESH_TOKEN_MAX_AGE,
            });
            return {
                token: token,
                id: tokenId
            };
        },
        enumerable: false,
        configurable: true
    });
    Token.prototype.replaceDbRefreshToken = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.throwUserIdError();
                        this.deleteDbRefreshToken();
                        return [4 /*yield*/, refresh_token_1.RefreshTokenModel.create({
                                tokenId: tokenId,
                                userId: this.userId,
                                // expireAt: new Date(Date.now() + refreshTokenMaxAge),
                                expireAt: new Date(Date.now() + 1000),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Token.prototype.deleteDbRefreshToken = function () {
        this.throwUserIdError();
        refresh_token_1.RefreshTokenModel.findOneAndRemove({ userId: this.userId }).exec();
    };
    Object.defineProperty(Token.prototype, "getAccessRefreshTokens", {
        get: function () {
            this.throwUserIdError();
            return ({
                access: this.getNewAccessToken.token,
                refresh: this.getNewRefreshToken.token,
            });
        },
        enumerable: false,
        configurable: true
    });
    Token.prototype.updateAccessRefreshTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessToken = this.getNewAccessToken;
                        refreshToken = this.getNewRefreshToken;
                        return [4 /*yield*/, this.replaceDbRefreshToken(refreshToken.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                access: accessToken.token,
                                refresh: refreshToken.token,
                            }];
                }
            });
        });
    };
    Token.prototype.getDecoded = function (token) {
        return jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, { algorithms: [process.env.TOKEN_ALGORITHM] });
    };
    Token.prototype.getDbRefreshToken = function (tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tokenId) return [3 /*break*/, 2];
                        return [4 /*yield*/, refresh_token_1.RefreshTokenModel.findOne({ tokenId: tokenId }).exec()];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, result];
                }
            });
        });
    };
    Token.prototype.setCookieTokens = function (accessToken, refreshToken, res) {
        return res
            .cookie(constants_1.ACCESS_TOKEN_NAME, accessToken, {
            httpOnly: false,
            maxAge: accessTokenMaxAge,
        })
            .cookie(constants_1.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenMaxAge,
        });
    };
    Token.prototype.removeCookieTokens = function (res) {
        return res
            .clearCookie(constants_1.ACCESS_TOKEN_NAME)
            .clearCookie(constants_1.REFRESH_TOKEN_NAME);
    };
    return Token;
}());
exports.Token = Token;
