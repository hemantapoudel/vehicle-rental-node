import { Router } from "express";

import * as AuthController from "../controllers/auth.controller";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { sendOTPSchema, verifyOTPSchema, } from "../schema/auth.schema";

const router = Router();

router.post("/send-otp", verifyInput(sendOTPSchema), AuthController.sendOTPController);
router.post("/verify-otp", verifyInput(verifyOTPSchema), AuthController.verifyOTPController)

export default router;