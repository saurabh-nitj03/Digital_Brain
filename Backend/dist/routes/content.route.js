"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_controller_1 = require("../controllers/content.controller");
const middleware_1 = require("../middleware/middleware");
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.route("").post(middleware_1.userMiddleware, multer_1.upload.single("file"), content_controller_1.createContent);
router.route("").get(middleware_1.userMiddleware, content_controller_1.getContent);
router.route("").delete(middleware_1.userMiddleware, content_controller_1.deleteContent);
router.route("/search").post(content_controller_1.contentSearch);
// AI Agent endpoints
router.route("/query").post(middleware_1.userMiddleware, content_controller_1.queryContent);
// router.route("/summary").get(userMiddleware, getContentSummary);
router.route("/:type").get(middleware_1.userMiddleware, content_controller_1.contentType);
exports.default = router;
