"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(name, msg) {
    var e = new Error(msg);
    if (name) {
        e.name = name;
    }
    return e;
}
exports.default = default_1;
