import { features } from "process";
import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
    vehicleFeatureSchema
} from "../schema/vehicle.schema";
import { prisma } from "../utils/db";

export const addCategory = async (categoryDetails: AddCategorySchema) => {
    const { title, description, logo } = categoryDetails;
    const category = await prisma.category.create({
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Category added", result: category };
};

export const addSubCategory = async (
    subCategoryDetails: AddSubCategorySchema,
) => {
    const { title, description, categoryId, logo } = subCategoryDetails;
    const subCategory = await prisma.subCategory.create({
        data: {
            title,
            description,
            logo,
            categoryId,
        },
    });
    return { msg: "Category added", result: subCategory };
};

export const addBrand = async (brandDetails: AddBrandSchema) => {
    const { title, description, logo } = brandDetails;
    const brand = await prisma.brand.create({
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Brand added", result: brand };
};

export const addVehicle = async (vehicleDetails: AddVehicleSchema) => {
    const {
        title,
        addedById,
        type,
        categoryId,
        subCategoryId,
        brandId,
        model,
        thumbnail,
        images,
        bluebookPics,
        vehicleNumber,
        description,
        rentGuidelines,
        rate,
        pickupAddress,
        driveTrain,
        insurancePaperPhoto,
        features
    } = vehicleDetails;

    const vehicle = await prisma.vehicle.create({
        data: {
            title,
            addedById,
            type,
            categoryId,
            subCategoryId,
            brandId,
            model,
            thumbnail,
            images,
            bluebookPics,
            vehicleNumber,
            description,
            rentGuidelines,
            rate,
            pickupAddress,
            driveTrain,
            insurancePaperPhoto,
            features:{
                create:features
            } 
        },

        select: {
            bluebookPics: false,
        },
    });
    return { msg: "Vehicle added", result: vehicle };
};
