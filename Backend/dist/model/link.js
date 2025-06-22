"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./user"));
const linkSchema = new mongoose_1.default.Schema({
    hash: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: user_1.default,
        required: true,
        unique: true,
    }
}, { timestamps: true });
const Link = mongoose_1.default.model('Link', linkSchema);
exports.default = Link;
