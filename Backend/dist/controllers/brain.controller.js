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
exports.getUser = exports.getAllSharedLink = exports.getLink = exports.createLink = void 0;
const content_1 = __importDefault(require("../model/content"));
const link_1 = __importDefault(require("../model/link"));
const brain_schema_1 = require("../schema/brain.schema");
const constant_1 = require("../utils/constant");
const user_1 = __importDefault(require("../model/user"));
const createLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = brain_schema_1.shareSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(403).json({
                success: false,
                message: parsed.error.issues[0].message
            });
        }
        const { share } = req.body;
        if (share) {
            const existingLink = yield link_1.default.findOne({ userId: req.userId });
            if (existingLink) {
                return res.status(200).json({
                    success: true,
                    message: "Link shared successfully",
                    hash: existingLink.hash
                });
            }
            const hash = (0, constant_1.random)(10);
            const newLink = yield link_1.default.create({
                userId: req.userId,
                hash
            });
            if (!newLink) {
                return res.status(403).json({
                    success: false,
                    message: "Link could not created"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Link shared successfully",
                hash: newLink.hash
            });
        }
        else {
            const deletedLink = yield link_1.default.deleteOne({
                userId: req.userId
            });
            if (!deletedLink) {
                return res.status(403).json({
                    success: false,
                    message: "Link not found",
                });
            }
            res.status(200).json({
                success: true,
                message: "Link removed successfully",
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        });
    }
});
exports.createLink = createLink;
const getLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = brain_schema_1.getSharedLinkSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(403).json({
                success: false,
                message: parsed.error.issues[0].message
            });
        }
        const { shareLink } = req.params;
        const link = yield link_1.default.findOne({
            hash: shareLink
        });
        if (!link) {
            return res.status(403).json({
                success: false,
                message: "Link Not Found"
            });
        }
        const content = yield content_1.default.find({
            userId: link.userId
        }).populate("userId", "username").sort({ createdAt: -1 });
        //    console.log(content)
        if (!content) {
            return res.status(403).json({
                success: false,
                message: "Content not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Content found successfully",
            content,
        });
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: err
        });
    }
});
exports.getLink = getLink;
const getAllSharedLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sharedLinks = yield link_1.default.find({})
            .populate("userId", "username")
            .sort({ createdAt: -1 });
        // console.log(sharedLinks);
        res.status(200).json({
            success: true,
            message: "Shared links fetched successfully",
            data: sharedLinks,
        });
    }
    catch (error) {
        // console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching shared links",
        });
    }
});
exports.getAllSharedLink = getAllSharedLink;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params.username;
        // console.log(username);
        const response = yield user_1.default.findOne({ username });
        // console.log(response)
        if (!response || response === null) {
            return res.status(404).json({
                success: false,
                message: "No user existed with this username"
            });
        }
        const link = yield link_1.default.findOne({ userId: response._id }).populate("userId", "username");
        if (!link) {
            return res.status(403).json({
                success: false,
                message: "No shared link existed with this username"
            });
        }
        // console.log(link)
        return res.status(200).json({
            success: true,
            message: "Shared Link found",
            link: [link]
        });
    }
    catch (err) {
        return res.status(403).json({
            success: false,
            message: err
        });
    }
});
exports.getUser = getUser;
