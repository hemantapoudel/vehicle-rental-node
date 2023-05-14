import { Router } from "express";

import * as BookingController from "../controllers/booking.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

router.post("/booking", isLoggedIn, BookingController.bookingController);
router.post("/booking/cancel", isLoggedIn, BookingController.cancelBookingController);
router.get("/booking/mybookings", isLoggedIn, BookingController.myBookingsController);
router.get("/booking/booking-requests", isLoggedIn, BookingController.myBookingRequestsController);
router.post("/booking/accept-or-reject", isLoggedIn, BookingController.acceptOrRejectController);


export default router;