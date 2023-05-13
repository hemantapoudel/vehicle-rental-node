import { NextFunction, Request, Response } from "express";

import { sendOTP, verifyOTP, } from "../services/auth.service";
import { SendOTPSchema, VerifyOTPSchema } from "../schema/auth.schema";

export async function sendOTPController(
    req: Request<{}, {}, SendOTPSchema>,
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
    req: Request<{}, {}, VerifyOTPSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const { phone, otp } = req.body;

        const response = await verifyOTP(parseInt(phone, 10), parseInt(otp));
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

