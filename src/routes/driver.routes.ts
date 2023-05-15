import { Router } from "express";

import * as AuthController from "../controllers/driver.controller";
import { isAdminOrModerator, isLoggedIn } from "../middlewares/auth.middleware";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import {sendOTPSchema, verifyOTPSchema,} from "../schema/auth.schema";
import { updateDriverProfileSchema } from "../schema/driver.schema";

const router = Router();

router.post("/driver/send-otp", verifyInput(sendOTPSchema), AuthController.sendOTPController);
router.post("/driver/verify-otp",verifyInput(verifyOTPSchema), AuthController.verifyOTPController)
router.put("/driver/update-profile", verifyInput(updateDriverProfileSchema),isLoggedIn, AuthController.updateDriverController);
router.get("/driver/view/unverified", isLoggedIn,isAdminOrModerator, AuthController.viewUnverifiedDriversController);
router.put("/driver/verify",isLoggedIn,isAdminOrModerator, AuthController.verifyDriverController);
router.post("/driver/view",isLoggedIn, AuthController.viewIndividualDriverController)
router.post("/driver/listall/nearme", isLoggedIn,AuthController.getDriversNearMeController);


export default router;