import { Router } from "express";
import {
  signup,
  signin,
  signout,
  check,
} from "../controllers/user.controller";
import { userMiddleware } from "../middleware/middleware";

const router = Router();

router.route("/signup").post(signup); 
router.route("/signin").post(signin);
router.route("/signout").post( userMiddleware, signout); 
router.route("/check").get( userMiddleware, check);
export default router;