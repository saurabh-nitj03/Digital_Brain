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
exports.contentType = exports.contentSearch = exports.deleteContent = exports.getContent = exports.createContent = void 0;
const content_1 = __importDefault(require("../model/content"));
const tags_1 = require("../model/tags");
const content_schema_1 = require("../schema/content.schema");
const cloudinary_1 = require("../utils/cloudinary");
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let processedBody = Object.assign({}, req.body);
        if (req.body.tags) {
            processedBody.tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
        }
        const parsed = content_schema_1.contentSchema.safeParse(processedBody);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
                errors: parsed.error.issues
            });
        }
        let { link, title, type, content, tags } = parsed.data;
        let allTags = [];
        if (tags && tags.length > 0) {
            if (tags.length > 10) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 10 tags allowed"
                });
            }
            let existingTags = yield tags_1.Tags.find({ title: { $in: tags } });
            let existingTagsTitle = existingTags.map((item) => item.title);
            let newTagsTitle = tags.filter((tag) => !existingTagsTitle.includes(tag));
            if (newTagsTitle.length > 0) {
                const newTags = yield tags_1.Tags.insertMany(newTagsTitle.map((tag) => ({ title: tag })));
                allTags = [...existingTagsTitle, ...newTags.map((tag) => tag.title)];
            }
            else {
                allTags = existingTagsTitle;
            }
        }
        if (req.file) {
            const localFilePath = req.file.path;
            const uploadFile = yield (0, cloudinary_1.uploadCloudinary)(localFilePath);
            if (!uploadFile) {
                return res.status(400).json({
                    success: false,
                    message: "File upload failed"
                });
            }
            link = uploadFile.url;
        }
        if ((type === "youtube" || type === "twitter" || type === "link") && !link) {
            return res.status(400).json({
                success: false,
                message: `Link is required for ${type} content`
            });
        }
        if ((type === "image" || type === "document") && !link && !req.file) {
            return res.status(400).json({
                success: false,
                message: `File is required for ${type} content`
            });
        }
        const newContent = yield content_1.default.create({
            title,
            type,
            link,
            content,
            tags: allTags,
            userId: req.userId,
        });
        if (!newContent) {
            return res.status(500).json({
                success: false,
                message: "Content creation failed"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Content added successfully",
            data: newContent
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
});
exports.createContent = createContent;
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const content = yield content_1.default.find({
            userId: userId
        }).populate("userId").sort({ createdAt: -1 });
        if (!content) {
            return res.status(403).json({
                success: false,
                message: "Content Not Found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Content found successfully",
            content
        });
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: err
        });
    }
});
exports.getContent = getContent;
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = content_schema_1.deleteSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(403).json({
                success: false,
                message: parsed.error.issues[0].message
            });
        }
        const { contentId } = req.body;
        // console.log(contentId ,req.userId)
        const content = yield content_1.default.findOneAndDelete({
            _id: contentId,
            userId: req.userId,
        });
        if (!content) {
            return res.status(403).json({
                success: false,
                message: "Content not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Content deleted Successfuly"
        });
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: err
        });
    }
});
exports.deleteContent = deleteContent;
const contentSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, query } = req.body;
        // console.log(query,userId)
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "User id is required"
            });
        }
        if (!query || typeof query !== "string") {
            return res.status(403).json({
                success: false,
                message: "Query is required"
            });
        }
        const q = query.trim();
        const response = yield content_1.default.find({
            userId: userId,
            $or: [
                { content: { $regex: q, $options: "i" } },
                { tags: { $elemMatch: { $regex: q, $options: "i" } } }
            ]
        });
        // console.log(response)
        if (!response) {
            return res.status(403).json({
                success: false,
                message: "Content not fetched"
            });
        }
        res.status(200).json({
            success: true,
            content: response,
            message: "Content fetched successfully"
        });
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: err
        });
    }
});
exports.contentSearch = contentSearch;
const contentType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const userId = req.userId;
        const content = yield content_1.default.find({
            userId: userId,
            type: type
        }).populate("userId").sort({ createdAt: -1 });
        if (!content) {
            return res.status(403).json({
                success: false,
                message: "Content Not found of this type"
            });
        }
        res.status(200).json({
            success: true,
            message: "Content fetched successfully",
            content
        });
    }
    catch (err) {
        return res.statu(403).json({
            success: false,
            message: err
        });
    }
});
exports.contentType = contentType;
