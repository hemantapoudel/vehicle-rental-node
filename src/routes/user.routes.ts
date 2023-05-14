import { Router } from "express";

import * as UserController from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { updateAddressSchema, updateProfileSchema } from "../schema/user.schema";

const router = Router();

router.post("/update-profile", verifyInput(updateProfileSchema), isLoggedIn, UserController.updateUserController);
router.post("/update-address", verifyInput(updateAddressSchema), isLoggedIn, UserController.updateAddressController);
router.get("/profile", isLoggedIn, UserController.getProfileController);


export default router;