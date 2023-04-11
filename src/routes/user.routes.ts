import { Router } from "express";

import * as UserController from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { updateProfileSchema } from "../schema/user.schema";

const router = Router();

router.post("/update-profile", verifyInput(updateProfileSchema),isLoggedIn, UserController.updateUserController);

export default router;