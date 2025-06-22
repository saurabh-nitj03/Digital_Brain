"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: "Username cannot be empty" }),
    password: zod_1.z.string().min(5, { message: "Password must be atleast 5 characters" }),
    confirmPassword: zod_1.z.string().min(5, { message: "Password must be atleast 5 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password does not match",
    path: ["confirmPassword"],
});
exports.signinSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, { message: "Username cannot be empty" }),
    password: zod_1.z.string().min(5, { message: "Password must be atleast 5 characters" }),
});
