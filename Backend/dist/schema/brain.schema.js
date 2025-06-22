"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedLinkSchema = exports.shareSchema = void 0;
const zod_1 = require("zod");
exports.shareSchema = zod_1.z.object({
    share: zod_1.z.boolean().default(false)
});
exports.getSharedLinkSchema = zod_1.z.object({
    shareLink: zod_1.z.string().min(5, { message: "Hash must be of atleast 10 characters" }).max(10, { message: "Hash must be of atmost 10 characters" })
});
