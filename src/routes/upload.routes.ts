import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
const uploader = require("../middlewares/uploader.middleware")

const router = Router();

router.post("/image", isLoggedIn, uploader.array('images'), uploadController);

export default router;