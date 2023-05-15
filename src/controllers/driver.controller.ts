import { NextFunction, Request, Response } from "express";

import { getDriversNearMe, sendOTP, updateDriverProfile, verifyDriver, verifyOTP, viewIndividualDriver, viewUnverifiedDrivers,} from "../services/driver.service";
import {SendOTPSchema, VerifyOTPSchema } from "../schema/auth.schema";
import { UpdateDriverProfileSchema } from "../schema/driver.schema";

export async function sendOTPController(
    req: Request<{},{},SendOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone } = req.body;
        const response = await sendOTP(parseInt(phone, 10));
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyOTPController(
    req: Request<{},{},VerifyOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone,otp } = req.body;
        
        const response = await verifyOTP(parseInt(phone, 10),parseInt(otp));
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function updateDriverController(
    req: Request<{}, {}, UpdateDriverProfileSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateDriverProfile(req.body, res.locals.user);
        return res.status(200).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}

export async function viewUnverifiedDriversController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await viewUnverifiedDrivers();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyDriverController(
    req: Request<{}, {}, { id:string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await verifyDriver(req.body.id);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function viewIndividualDriverController(
    req: Request<{}, {}, { id:string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await viewIndividualDriver(req.body.id);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getDriversNearMeController(
    req: Request<{}, {}, { lat: number; lon: number; radius:number }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getDriversNearMe(req.body.lat, req.body.lon, req.body.radius);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}