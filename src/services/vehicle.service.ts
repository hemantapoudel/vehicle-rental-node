import { VehicleType } from "@prisma/client";
import { features } from "process";
import {
    AddBrandSchema,
    AddCategorySchema,
    AddSubCategorySchema,
    AddVehicleSchema,
    vehicleFeatureSchema,
} from "../schema/vehicle.schema";
import { calculateDistance } from "../utils/calculateDistance";
import { prisma } from "../utils/db";
import config from "../config/env";

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

export const addVehicle = async (
    vehicleDetails: AddVehicleSchema,
    loggedInUser: any,
) => {
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
        features,
    } = vehicleDetails;

    const vehicle = await prisma.vehicle.create({
        data: {
            title,
            addedById: loggedInUser.id,
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
            features: {
                create: features,
            },
        },
    });
    return { msg: "Vehicle added", result: vehicle };
};

export const listAllVehicle = async () => {
    let vehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: true,
        },
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            category: {
                select: {
                    id: true,
                    title: true,
                },
            },
            subCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            brand: {
                select: {
                    id: true,
                    title: true,
                    logo: true,
                },
            },
            model: true,
            thumbnail: true,
            isBooked: true,
        },
    });
    vehicles.map((vehicle) => {
        vehicle.thumbnail = `${config.UPLOADS}${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.UPLOADS}${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles fetched", result: vehicles };
};

export const getVehiclesNearMe = async (lat: number, lon: number) => {
    let allVehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: true,
        },
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            category: {
                select: {
                    id: true,
                    title: true,
                },
            },
            subCategory: {
                select: {
                    id: true,
                    title: true,
                },
            },
            brand: {
                select: {
                    id: true,
                    title: true,
                    logo: true,
                },
            },
            model: true,
            thumbnail: true,
            pickupAddress: true,
            isBooked: true,
        },
    });

    let newArr: Array<any> = [];

    for (let i = 0; i < allVehicles.length; i++) {
        const distance = calculateDistance(
            lat,
            lon,
            Number(allVehicles[i].pickupAddress[0]),
            Number(allVehicles[i].pickupAddress[1]),
        );

        const newVehicleList = {
            ...allVehicles[i],
            distance,
        };

        if (distance <= 15) {
            newArr.push(newVehicleList);
        }
    }

    newArr.map((vehicle) => {
        vehicle.thumbnail = `${config.UPLOADS}${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.UPLOADS}${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles near me fetched", result: newArr };
};
