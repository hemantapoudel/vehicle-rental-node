import { Router } from "express";

import auth from "./auth.routes";
import user from "./user.routes";
import vehicle from "./vehicle.routes"
import upload from "./upload.routes"
import booking from "./booking.routes"
import driver from "./driver.routes"

export const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/vehicle", vehicle)
router.use("/upload", upload)
router.use("/",booking)
router.use("/",driver)
