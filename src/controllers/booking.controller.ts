import { NextFunction, Request, Response } from "express";
import { acceptOrRejectBooking, booking, cancelBooking, myBookingRequests, myBookings } from "../services/booking.service";

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

export async function cancelBookingController(
    req: Request<{}, {}, { vehicleId: string}>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await cancelBooking(
            req.body.vehicleId,
            res.locals.user
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function myBookingsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await myBookings(
            res.locals.user
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function myBookingRequestsController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await myBookingRequests(
            res.locals.user
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function acceptOrRejectController(
    req: Request<{}, {}, {id:string, status:any  }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await acceptOrRejectBooking(
            res.locals.user, req.body.status, req.body.id
        );
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}