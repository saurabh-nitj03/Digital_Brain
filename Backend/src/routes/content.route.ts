import { contentSearch, contentType, createContent, deleteContent, getContent, queryContent,  } from "../controllers/content.controller";
import { userMiddleware } from "../middleware/middleware";
import { Router } from "express";
import {upload} from "../middleware/multer";

const router=Router();

router.route("").post( userMiddleware,upload.single("file"), createContent); 
router.route("").get( userMiddleware, getContent); 
router.route("").delete(userMiddleware, deleteContent); 
router.route("/search").post(contentSearch); 

// AI Agent endpoints
router.route("/query").post(userMiddleware, queryContent);
// router.route("/summary").get(userMiddleware, getContentSummary);

router.route("/:type").get(userMiddleware,contentType)
export default router
