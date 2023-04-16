import { VehicleType } from "@prisma/client";
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

export const addVehicle = async (vehicleDetails: AddVehicleSchema, loggedInUser:any) => {
    const {
        title,
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
            addedById:loggedInUser.id,
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
        }
    });
    return { msg: "Vehicle added", result: vehicle };
};

export const listAllVehicle = async () => {
    let vehicles = await prisma.vehicle.findMany({
        where:{
            isVerified:true
        },
        select:{
            id:true,
            title:true,
            addedById:true,
            type:true,
            category:{
                select:{
                    id:true,
                    title:true
                }
            },
            subCategory:{
                select:{
                    id:true,
                    title:true
                }
            },
            brand:{
                select:{
                    id:true,
                    title:true,
                    logo:true
                }
            },
            model:true,
            thumbnail:true
        }
    })
    vehicles.map(vehicle => {
        vehicle.thumbnail = `http://localhost:8080/uploads/${vehicle.thumbnail}`;
        vehicle.brand.logo = `http://localhost:8080/uploads/${vehicle.brand.logo}`;
        return vehicle;
      });


    return {msg:"Vehicles fetched", result:vehicles}
}
