"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chunkSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chunktext: {
        type: String,
        required: true
    },
    embedding: {
        type: Array,
        required: true
    },
    source: {
        type: String,
        default: "Unknown"
    },
    contentType: {
        type: String,
        enum: ['pdf', 'image', 'web', 'youtube', 'twitter', 'text'],
        default: 'text'
    },
    metadata: {
        originalFileName: String,
        url: String,
        pageNumber: Number,
        confidence: Number
    }
}, { timestamps: true });
// Create a vector search index for the embedding field
chunkSchema.index({ id: 1 });
const Chunk = mongoose_1.default.model("Chunk", chunkSchema);
exports.default = Chunk;
