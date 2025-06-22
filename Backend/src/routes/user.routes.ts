import { Router } from "express";
import {
  signup,
  signin,
  signout,
  check,
} from "../controllers/user.controller";
import { userMiddleware } from "../middleware/middleware";

const router = Router();

router.route("/signup").post(signup); // API 1: http://localhost:3000/api/v1/user/signup
router.route("/signin").post(signin); // API 2: http://localhost:3000/api/v1/user/signin
router.route("/signout").post( userMiddleware, signout); // API 3: http://localhost:3000/api/v1/user/signout
router.route("/check").get( userMiddleware, check); // API 4: http://localhost:3000/api/v1/user/check
export default router;