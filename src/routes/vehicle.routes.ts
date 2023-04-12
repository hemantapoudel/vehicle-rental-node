import { Router } from "express";

import * as VehicleController from "../controllers/vehicle.controller";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { addBrandSchema, addCategorySchema, addSubCategorySchema } from "../schema/vehicle.schema";
import { addSubCategory } from "../services/vehicle.service";

const router = Router();

router.post("/add/category", verifyInput(addCategorySchema), VehicleController.addCategoryController);
router.post("/add/subcategory", verifyInput(addSubCategorySchema),VehicleController.addSubCategoryController);
router.post("/add/brand", verifyInput(addBrandSchema),VehicleController.addBrandController);


export default router;