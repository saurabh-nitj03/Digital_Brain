"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tags = void 0;
const mongoose_1 = require("mongoose");
const tagsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
exports.Tags = (0, mongoose_1.model)("Tags", tagsSchema);
