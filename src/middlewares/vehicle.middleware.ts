import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import config from "../config/env";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export const canAddVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: res.locals.user.id
            }
        })
        if (!user) {
            throw new CustomError(401, "Unauthorized access");
        }
        if (user.isActive == false || user.isProfileUpdated == false || user.isAddressUpdated == false || user.phoneVerified == false) {
            throw new CustomError(401, "Unauthorized access! update your profile and address");
        }
        next()

    } catch (error: any) {
        throw new CustomError(400, "Unauthorized");
    }
};
