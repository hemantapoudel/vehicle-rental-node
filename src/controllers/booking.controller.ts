import { NextFunction, Request, Response } from "express";
import { booking } from "../services/booking.service";

export async function bookingController(
    req: Request<{}, {}, { vehicleId: string; startDate: Date; endDate: Date }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await booking(
            req.body.vehicleId,
            res.locals.user,
            req.body.startDate,
            req.body.endDate,
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}
