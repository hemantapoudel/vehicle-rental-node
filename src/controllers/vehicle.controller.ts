import { NextFunction, Request, Response } from "express";

import {} from "../schema/auth.schema";
import { AddBrandSchema, AddCategorySchema, AddSubCategorySchema, AddVehicleSchema } from "../schema/vehicle.schema";
import { addBrand, addCategory, addSubCategory, addVehicle } from "../services/vehicle.service";

export async function addCategoryController(
    req: Request<{}, {}, AddCategorySchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await addCategory(req.body);
        return res.status(201).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}

export async function addSubCategoryController(
    req: Request<{}, {}, AddSubCategorySchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await addSubCategory(req.body);
        return res.status(201).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}

export async function addBrandController(
    req: Request<{}, {}, AddBrandSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await addBrand(req.body);
        return res.status(201).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}

export async function addVehicleController(
    req: Request<{}, {}, AddVehicleSchema>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await addVehicle(req.body,res.locals.user);
        return res.status(201).json({ success: true, data: response });

    } catch (e: any) {
        next(e);
    }
}