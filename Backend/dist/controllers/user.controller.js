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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.signout = exports.signin = exports.signup = void 0;
const user_1 = __importDefault(require("../model/user"));
const user_schema_1 = require("../schema/user.schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constant_1 = require("../utils/constant");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {username,password} = req.body;
        const parsed = user_schema_1.signupSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(403).json({
                success: false,
                message: parsed.error.issues[0].message
            });
        }
        const { username, password, confirmPassword } = req.body;
        const user = yield user_1.default.findOne({ username });
        if (user) {
            return res.status(403).json({
                success: false,
                message: "User already existed with this username"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 2);
        const newUser = yield user_1.default.create({
            username: username,
            password: hashedPassword
        });
        if (!newUser) {
            return res.status(403).json({
                success: false,
                message: "User creation failed"
            });
        }
        return res.status(201).json({
            success: true,
            message: "user signed up successfully"
        });
    }
    catch (err) {
        return res.status(500).send({
            success: false,
            message: "Something went wrong"
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = user_schema_1.signinSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(403).json({
                success: false,
                message: parsed.error.issues[0].message
            });
        }
        const { username, password } = req.body;
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User doesnot exist"
            });
        }
        const PasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!PasswordCorrect) {
            return res.status(403).json({
                success: false,
                message: "Password is not correct"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, constant_1.JWT_PASSWORD, {
            expiresIn: "1d"
        });
        res.cookie("jwt", token, user._id, {
            httpOnly: true,
            secure: true,
            expires: "1d",
        });
        return res.status(200).json({
            success: true,
            message: "User signed in Successfully",
            token
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong" + err
        });
    }
});
exports.signin = signin;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0),
        });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});
exports.signout = signout;
const check = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
            userId: req.userId,
            message: "User is authenticated",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            isAuthenticated: false,
            message: "An error occurred while checking authentication",
        });
    }
});
exports.check = check;
