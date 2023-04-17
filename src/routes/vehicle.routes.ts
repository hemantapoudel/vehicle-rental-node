import { Router } from "express";

import * as VehicleController from "../controllers/vehicle.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { addBrandSchema, addCategorySchema, addSubCategorySchema, addVehicleSchema } from "../schema/vehicle.schema";
import { addSubCategory } from "../services/vehicle.service";

const router = Router();

router.post("/add/category", verifyInput(addCategorySchema), VehicleController.addCategoryController);
router.post("/add/subcategory", verifyInput(addSubCategorySchema),VehicleController.addSubCategoryController);
router.post("/add/brand", verifyInput(addBrandSchema),VehicleController.addBrandController);
router.post("/add/vehicle", isLoggedIn,verifyInput(addVehicleSchema),VehicleController.addVehicleController);
router.get("/listall/vehicle", isLoggedIn,VehicleController.listAllVehicleController);
router.get("/listall/nearme", isLoggedIn,VehicleController.getVehiclesNearMeController);


export default router;