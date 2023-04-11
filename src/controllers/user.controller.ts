import { NextFunction, Request, Response } from "express";

import {} from "../schema/auth.schema";
import { UpdateProfileSchema } from "../schema/user.schema";
import { updateProfile } from "../services/user.service";


export async function updateUserController(
    req: Request<{}, {}, UpdateProfileSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateProfile(req.body, res.locals.user);
        return res.status(201).json({ success: true, data: response });
        
    } catch (e: any) {
        next(e);
    }
}