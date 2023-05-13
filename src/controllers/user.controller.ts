import { NextFunction, Request, Response } from "express";

import { } from "../schema/auth.schema";
import { UpdateAddressSchema, UpdateProfileSchema } from "../schema/user.schema";
import { getProfile, updateAddress, updateProfile } from "../services/user.service";


export async function updateUserController(
    req: Request<{}, {}, UpdateProfileSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateProfile(req.body, res.locals.user);
        return res.status(200).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}

export async function updateAddressController(
    req: Request<{}, {}, UpdateAddressSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateAddress(req.body, res.locals.user)
        return res.status(201).json({ success: true, data: response })

    } catch (e: any) {
        next(e);
    }
}

export async function getProfileController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getProfile(res.locals.user)
        return res.status(200).json({ success: true, data: response })

    } catch (e: any) {
        next(e);
    }
}