"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.JWT_PASSWORD = exports.random = exports.ContentType = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_PASSWORD = process.env.JWT_PASSWORD;
exports.JWT_PASSWORD = JWT_PASSWORD;
// console.log(JWT_PASSWORD)
const port = process.env.PORT;
exports.port = port;
const ContentType = ['youtube', 'twitter', 'document', 'image', 'link'];
exports.ContentType = ContentType;
// console.log(port);
const random = (len) => {
    let options = "ndkjnmcnisjdkvisjakpaajwoew";
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[Math.floor(Math.random() * options.length)];
    }
    return ans;
};
exports.random = random;
