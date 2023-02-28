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
exports.httpServer = exports.app = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var routes_1 = __importDefault(require("./routes"));
var index_1 = __importDefault(require("@middlewares/index"));
var mongoose_1 = __importDefault(require("mongoose"));
var http_1 = __importDefault(require("http"));
var socket_1 = __importDefault(require("./configs/socket"));
var jwt_1 = require("@middlewares/jwt");
dotenv_1.default.config();
console.clear();
var jwtMiddleware = index_1.default.jwtMiddleware, errorsHandlerMiddleware = index_1.default.errorsHandlerMiddleware, corsMiddleware = index_1.default.corsMiddleware;
exports.app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
exports.httpServer = http_1.default.createServer(exports.app);
var ioServer = (0, socket_1.default)();
var mockNotifications = [
    { id: '0', title: 'Title notification 0', body: 'Some text', isNew: true, createdAt: Date() },
    { id: '1', title: 'Title notification 1', body: 'Some text', createdAt: Date() },
];
var serverStart = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // -- MIDDLEWARES
            exports.app.use(corsMiddleware);
            exports.app.use(body_parser_1.default.json());
            exports.app.use((0, cookie_parser_1.default)());
            exports.app.use(jwtMiddleware.unless(jwt_1.unlessParams));
            exports.app.use(routes_1.default);
            exports.app.use(errorsHandlerMiddleware);
            // -- MIDDLEWARES
            ioServer.on('connection', function (socket) {
                console.log("\u26A1: ".concat(socket.id, " user just connected!"));
                socket.emit('notifications', { data: { notifications: mockNotifications } });
                socket.on('disconnect', function () {
                    console.log('🔥: A user disconnected');
                });
            });
            // app.get('/socket.io');
            mongoose_1.default.connection.on('open', function (ref) {
                console.log('MongoDB connected.');
                //trying to get collection names
                /*mongoose.connection.db.listCollections().toArray(function (err, names) {
                  console.log(names); // [{ name: 'dbname.myCollection' }]
                });*/
            });
            exports.httpServer.listen(PORT, function () {
                console.log("Server listening on ".concat(PORT));
            });
        }
        catch (e) {
            console.log('serverStart() e: ', e);
        }
        return [2 /*return*/];
    });
}); };
serverStart();
