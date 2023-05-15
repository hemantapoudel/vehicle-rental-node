import { NextFunction, Request, Response } from "express";

import { } from "../schema/auth.schema";
import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
} from "../schema/vehicle.schema";
import {
    addBrand,
    addCategory,
    addSubCategory,
    addVehicle,
    deleteBrand,
    deleteCategory,
    deleteSubCategory,
    findSubCategoryFromCategory,
    getVehiclesNearMe,
    listAllBrands,
    listAllCategory,
    listAllSubCategory,
    listAllVehicle,
    searchVehicles,
    updateBrand,
    updateCategory,
    updateSubCategory,
    verifyVehicle,
    viewIndividualVehicle,
    viewUnverifiedVehicles,
} from "../services/vehicle.service";

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

export async function updateCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateCategory(req.params.id, req.body);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await listAllCategory();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await deleteCategory(req.params.id);
        return res.status(200).json({ success: true, data: response });
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

export async function updateSubCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateSubCategory(req.params.id, req.body);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllSubCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await listAllSubCategory();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteSubCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await deleteSubCategory(req.params.id);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function findSubCategoryFromCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await findSubCategoryFromCategory(req.body.categoryId);
        return res.status(200).json({ success: true, data: response });
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

export async function updateBrandController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await updateBrand(req.params.id, req.body);
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllBrandController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await listAllBrands();
        return res.status(200).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function deleteBrandController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await deleteBrand(req.params.id);
        return res.status(200).json({ success: true, data: response });
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
        const response = await addVehicle(req.body, res.locals.user);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function listAllVehicleController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await listAllVehicle();
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function getVehiclesNearMeController(
    req: Request<{}, {}, { lat: number; lon: number; radius: number }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await getVehiclesNearMe(req.body.lat, req.body.lon, req.body.radius);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function searchVehiclesController(
    req: Request<{}, {}, { searchString: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await searchVehicles(req.body.searchString);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function viewUnverifiedVehiclesController(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await viewUnverifiedVehicles();
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function viewIndividualVehicleController(
    req: Request<{}, {}, { id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await viewIndividualVehicle(req.body.id);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}

export async function verifyVehicleController(
    req: Request<{}, {}, { id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const response = await verifyVehicle(req.body.id);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}