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
exports.unlessParams = void 0;
var constants_1 = require("../constants");
var dotenv_1 = __importDefault(require("dotenv"));
var token_1 = require("../services/token");
var get_custom_error_1 = __importDefault(require("../services/get-custom-error"));
var express_unless_1 = require("express-unless");
dotenv_1.default.config();
var excludedPaths = ['/public', '/login', /*'/socket.io/'*/];
exports.unlessParams = {
    path: excludedPaths,
};
var jwtMiddleware = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, accessTokenName, refreshTokenName, accessToken, refreshToken, decoded, decoded, _a, type, id, dbRefreshToken, _b, access, refresh, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                cookies = req.cookies;
                accessTokenName = 'access';
                refreshTokenName = 'refresh';
                accessToken = cookies[accessTokenName];
                refreshToken = cookies[refreshTokenName];
                if (!accessToken) return [3 /*break*/, 1];
                try {
                    decoded = new token_1.Token({}).getDecoded(accessToken);
                    if (typeof decoded !== 'string' &&
                        (decoded === null || decoded === void 0 ? void 0 : decoded.type) !== constants_1.ACCESS_TOKEN_NAME) {
                        next((0, get_custom_error_1.default)('UnauthorizedError', 'Invalid token... (access)'));
                    }
                }
                catch (e) {
                    next(e);
                }
                return [3 /*break*/, 10];
            case 1:
                if (!refreshToken) return [3 /*break*/, 9];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 7, , 8]);
                decoded = new token_1.Token({}).getDecoded(refreshToken);
                if (!(typeof decoded !== 'string')) return [3 /*break*/, 6];
                _a = decoded || {}, type = _a.type, id = _a.id;
                if (type !== constants_1.REFRESH_TOKEN_NAME) {
                    next((0, get_custom_error_1.default)('UnauthorizedError', 'Invalid token... (refresh)'));
                }
                return [4 /*yield*/, new token_1.Token({}).getDbRefreshToken(id)];
            case 3:
                dbRefreshToken = _c.sent();
                if (!dbRefreshToken) return [3 /*break*/, 5];
                return [4 /*yield*/, new token_1.Token({ userId: dbRefreshToken.userId })
                        .updateAccessRefreshTokens()];
            case 4:
                _b = _c.sent(), access = _b.access, refresh = _b.refresh;
                new token_1.Token({}).setCookieTokens(access, refresh, res);
                return [3 /*break*/, 6];
            case 5:
                next((0, get_custom_error_1.default)('UnauthorizedError', 'Invalid token... (refresh) (db)'));
                _c.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _c.sent();
                next(e_1);
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                next((0, get_custom_error_1.default)('UnauthorizedError', 'Invalid tokens...'));
                _c.label = 10;
            case 10:
                next();
                return [2 /*return*/];
        }
    });
}); };
jwtMiddleware.unless = express_unless_1.unless;
exports.default = jwtMiddleware;
