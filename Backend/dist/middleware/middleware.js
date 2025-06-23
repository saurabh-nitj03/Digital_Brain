"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../utils/constant");
const userMiddleware = (req, res, next) => {
    var _a;
    let token = req.headers["authorization"];
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    console.log('Raw cookie header:', req.get('Cookie'));
    console.log(req.cookie);
    if (!token) {
        token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
        // console.log(token);
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User not Authenticated"
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constant_1.JWT_PASSWORD);
        if (decoded) {
            if (typeof decoded === "string") {
                return res.status(403).json({
                    success: false,
                    message: "you are not logged in"
                });
            }
        }
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
