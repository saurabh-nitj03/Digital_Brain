"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContentSchema = exports.deleteSchema = exports.contentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const constant_1 = require("../utils/constant");
exports.contentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title cannot be empty" }),
    type: zod_1.z.enum(constant_1.ContentType).refine((val) => constant_1.ContentType.includes(val), { message: `Type must be one of ${constant_1.ContentType.join(',')}` }),
    tags: zod_1.z.array(zod_1.z.string()).max(10, { message: "Tags must be at most 10" }).optional(),
    content: zod_1.z.string().max(500, { message: "Content Length must be at most 500 characters" }).optional(),
    link: zod_1.z.preprocess((val) => typeof val === "string" && val.trim() === "" ? undefined : val, zod_1.z.string().url({ message: "Link must be valid url" }).optional())
});
exports.deleteSchema = zod_1.z.object({
    contentId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), { message: "Invalid ContentId" })
});
exports.updateContentSchema = zod_1.z.object({
    contentId: zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
        message: "Invalid contentId",
    }),
    title: zod_1.z.string(),
    type: zod_1.z.enum(constant_1.ContentType).refine((val) => constant_1.ContentType.includes(val), { message: `Type must be one of ${constant_1.ContentType.join(',')}` }),
    tags: zod_1.z.array(zod_1.z.string()).max(10, { message: "Tags must be at most 10" }).optional(),
    content: zod_1.z.string().max(500, { message: "Content Length must be at most 500 characters" }).optional(),
    link: zod_1.z.preprocess((val) => typeof val === "string" && val.trim() === "" ? undefined : val, zod_1.z.string().url({ message: "Link must be valid url" }).optional())
});
