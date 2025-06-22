"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const contentTypes = ['image', 'video', 'article', 'audio'];
const contentSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['youtube', 'twitter', 'document', 'image', 'link'],
        required: true
    },
    link: {
        type: String,
    },
    content: {
        type: String,
    },
    // tags:[
    //     {type:mongoose.Schema.Types.ObjectId,
    //     ref:Tags}
    // ],
    tags: {
        type: String
    },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
});
const Content = mongoose_1.default.model('Content', contentSchema);
exports.default = Content;
