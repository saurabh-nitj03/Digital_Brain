"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const middleware_1 = require("../middleware/middleware");
const router = (0, express_1.Router)();
router.route("/signup").post(user_controller_1.signup); // API 1: http://localhost:3000/api/v1/user/signup
router.route("/signin").post(user_controller_1.signin); // API 2: http://localhost:3000/api/v1/user/signin
router.route("/signout").post(middleware_1.userMiddleware, user_controller_1.signout); // API 3: http://localhost:3000/api/v1/user/signout
router.route("/check").get(middleware_1.userMiddleware, user_controller_1.check); // API 4: http://localhost:3000/api/v1/user/check
exports.default = router;
