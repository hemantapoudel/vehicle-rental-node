import { Router } from "express";

import * as BookingController from "../controllers/booking.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post("/booking", isLoggedIn, BookingController.bookingController);


export default router;