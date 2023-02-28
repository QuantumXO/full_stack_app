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
var users_1 = require("../models/users");
var bcrypt_1 = __importDefault(require("bcrypt"));
var token_1 = require("../services/token");
var dotenv_1 = __importDefault(require("dotenv"));
var lodash_1 = require("lodash");
dotenv_1.default.config();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, selectedUser, isValidPassword, resultUser, _b, accessToken, refreshToken, responseWithCookies;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, username = _a.username, password = _a.password;
                    if (!(!username || !password)) return [3 /*break*/, 1];
                    return [2 /*return*/, res.status(400).json({ message: 'username or password is missing' })];
                case 1: return [4 /*yield*/, users_1.UserModel
                        .findOne({ userName: username })
                        .lean()
                        .select('_id userName password location')
                        .exec()];
                case 2:
                    selectedUser = _c.sent();
                    if (!selectedUser) return [3 /*break*/, 7];
                    return [4 /*yield*/, bcrypt_1.default.compare(password, selectedUser.password)];
                case 3:
                    isValidPassword = _c.sent();
                    if (!isValidPassword) return [3 /*break*/, 5];
                    resultUser = {
                        id: String(selectedUser._id),
                        userName: selectedUser.userName,
                        password: selectedUser.password,
                        location: selectedUser.location
                    };
                    return [4 /*yield*/, new token_1.Token({ userId: resultUser.id }).updateAccessRefreshTokens()];
                case 4:
                    _b = _c.sent(), accessToken = _b.access, refreshToken = _b.refresh;
                    responseWithCookies = new token_1.Token({}).setCookieTokens(accessToken, refreshToken, res);
                    return [2 /*return*/, responseWithCookies
                            .status(200)
                            .json({
                            user: resultUser,
                            message: 'Login is done! [POST]'
                        })];
                case 5:
                    res.status(400).json({ error: 'Incorrect password or username' });
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, res.status(401).json({ error: 'User not found' })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, selectedUser, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, username = _a.username, password = _a.password;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, users_1.UserModel
                            .findOne({ userName: username })
                            .exec()];
                case 2:
                    selectedUser = _b.sent();
                    if (!username || !password) {
                        res.status(400).json({ error: 'Incorrect password or username' });
                    }
                    else {
                        if (selectedUser) {
                            res
                                .status(401)
                                .json({ message: "".concat(username, " already exist") });
                        }
                        else {
                        }
                    }
                    res
                        .status(200)
                        .json({ message: 'SignUp is done! [POST]' });
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function logOut(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var cookies, accessTokenName, accessToken, decoded, userId, responseWithoutCookies;
        return __generator(this, function (_a) {
            cookies = req.cookies;
            accessTokenName = 'access';
            accessToken = cookies[accessTokenName];
            decoded = new token_1.Token({}).getDecoded(accessToken);
            userId = (0, lodash_1.get)(decoded, 'userId');
            new token_1.Token({ userId: userId }).deleteDbRefreshToken();
            responseWithoutCookies = new token_1.Token({}).removeCookieTokens(res);
            try {
                responseWithoutCookies
                    .status(200)
                    .json({ message: 'Logout is done! [POST]' })
                    .end();
            }
            catch (e) {
                console.log(e);
            }
            return [2 /*return*/];
        });
    });
}
exports.default = {
    login: login,
    signUp: signUp,
    logOut: logOut,
};
