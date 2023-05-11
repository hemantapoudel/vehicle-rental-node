import { Router } from "express";

import * as VehicleController from "../controllers/vehicle.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
import { verifyInput } from "../middlewares/verifyInput.middleware";
import { addBrandSchema, addCategorySchema, addSubCategorySchema, addVehicleSchema } from "../schema/vehicle.schema";
import { addSubCategory } from "../services/vehicle.service";

const router = Router();

router.post("/category/add", verifyInput(addCategorySchema), VehicleController.addCategoryController);
router.put("/category/update/:id", VehicleController.updateCategoryController);
router.get("/category/listall", VehicleController.listAllCategoryController);
router.delete("/category/delete/:id", VehicleController.deleteCategoryController);

router.post("/subcategory/add", verifyInput(addSubCategorySchema),VehicleController.addSubCategoryController);
router.put("/subcategory/update/:id", VehicleController.updateSubCategoryController);
router.get("/subcategory/listall", VehicleController.listAllSubCategoryController);
router.delete("/subcategory/delete/:id", VehicleController.deleteSubCategoryController);
router.post("/subcategory/findbycategory", VehicleController.findSubCategoryFromCategoryController);


router.post("/brand/add", verifyInput(addBrandSchema),VehicleController.addBrandController);
router.put("/brand/update/:id", VehicleController.updateBrandController);
router.get("/brand/listall", VehicleController.listAllBrandController);
router.delete("/brand/delete/:id", VehicleController.deleteBrandController);



router.post("/add/vehicle", isLoggedIn,verifyInput(addVehicleSchema),VehicleController.addVehicleController);
router.get("/listall/vehicle", isLoggedIn,VehicleController.listAllVehicleController);
router.get("/listall/nearme", isLoggedIn,VehicleController.getVehiclesNearMeController);
router.get("/search", isLoggedIn,VehicleController.searchVehiclesController);

export default router;