import { Router } from "express";
import { userMiddleware } from "../middleware/middleware";
import { createLink, getAllSharedLink, getLink, getUser } from "../controllers/brain.controller";

const router = Router();

router.route("/share").post( userMiddleware, createLink); 
router.route("/shared-brain").get(getAllSharedLink);
router.route("/hash/:shareLink").get(getLink);
router.route("/getuser/:username").get(getUser);
export default router