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
import { CustomError } from "../utils/custom_error";

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

export const updateCategory = async (id: string, categoryDetails: any) => {
    const { title, description, logo } = categoryDetails;
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Category updated" };
};

export const listAllCategory = async () => {
    const category = await prisma.category.findMany();
    return { msg: "ALl Category Fetched", result: category };
};

export const deleteCategory = async (id: string) => {
    await prisma.category.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Category Deleted" };
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
    return { msg: "sub Category added", result: subCategory };
};

export const updateSubCategory = async (
    id: string,
    subCategoryDetails: any,
) => {
    const { title, description, categoryId, logo } = subCategoryDetails;
    const subCategory = await prisma.subCategory.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
            categoryId,
        },
    });
    return { msg: "SUbCategory Updated" };
};

export const listAllSubCategory = async () => {
    const subCategory = await prisma.subCategory.findMany();
    return { msg: "ALl Sub Categories Fetched", result: subCategory };
};

export const deleteSubCategory = async (id: string) => {
    await prisma.subCategory.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Sub-Category Deleted" };
};

export const findSubCategoryFromCategory = async (categoryId: string) => {
    const subCategory = await prisma.subCategory.findMany({
        where: {
            categoryId,
        },
    });
    console.log();
    return { msg: "Sub Categories Fetched", result: subCategory };
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

export const updateBrand = async (id: string, brandDetails: any) => {
    const { title, description, logo } = brandDetails;
    const brand = await prisma.brand.update({
        where: {
            id: id,
        },
        data: {
            title,
            description,
            logo,
        },
    });
    return { msg: "Brand Updated" };
};

export const listAllBrands = async () => {
    const brands = await prisma.brand.findMany();
    return { msg: "ALl Brands Fetched", result: brands };
};

export const deleteBrand = async (id: string) => {
    await prisma.brand.delete({
        where: {
            id: id,
        },
    });
    return { msg: "Brand Deleted" };
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
            rate: true,
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
        vehicle.thumbnail = `${config.UPLOADS}/${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.UPLOADS}/${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles fetched", result: vehicles };
};

export const getVehiclesNearMe = async (lat: number, lon: number, radius: number) => {
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

        if (distance <= radius) {
            newArr.push(newVehicleList);
        }
    }

    newArr.map((vehicle) => {
        vehicle.thumbnail = `${config.UPLOADS}/${vehicle.thumbnail}`;
        vehicle.brand.logo = `${config.UPLOADS}/${vehicle.brand.logo}`;
        return vehicle;
    });

    return { msg: "Vehicles near me fetched", result: newArr };
};

export const searchVehicles = async (searchString: string) => {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            OR: [
                { title: { contains: searchString } },
                { brand: { title: { contains: searchString } } },
            ],
        },
    });
    vehicles.map((vehicle) => {
        vehicle.thumbnail = `${config.UPLOADS}/${vehicle.thumbnail}`;
        return vehicle;
    });
    return { msg: "Vehicles fetched", result: vehicles };
};

export const viewUnverifiedVehicles = async () => {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            isVerified: false,
        },
    });
    vehicles.map((vehicle) => {
        vehicle.thumbnail = `${config.UPLOADS}/${vehicle.thumbnail}`;
        return vehicle;
    });

    return { msg: "Unverified Vehicles fetched", result: vehicles };
};

export const viewIndividualVehicle = async (id: string) => {
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            addedById: true,
            type: true,
            description: true,
            rate: true,
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
            images: true,
            bluebookPics: true,
            insurancePaperPhoto: true,
            isVerified: true,
            features: true,
        },
    });
    if (!vehicle) {
        throw new Error("Vehicle not found");
    }
    vehicle.thumbnail = `${config.UPLOADS}/${vehicle.thumbnail}`;
    vehicle.images = vehicle.images.map(
        (imageName) => `${config.UPLOADS}/${imageName}`,
    );
    vehicle.bluebookPics = vehicle.bluebookPics.map(
        (imageName) => `${config.UPLOADS}/${imageName}`,
    );
    vehicle.insurancePaperPhoto = `${config.UPLOADS}/${vehicle.insurancePaperPhoto}`;
    vehicle.brand.logo = `${config.UPLOADS}/${vehicle.brand.logo}`;

    return { msg: "Vehicle details", result: vehicle };
};

export const verifyVehicle = async (id: string) => {
    const vehicle = await prisma.vehicle.findUnique({
        where: {
            id
        }
    })
    if (!vehicle) {
        throw new Error("Vehicle Not Found")
    }
    if (vehicle.isVerified == true) {
        return { msg: "Vehicle Already Verified" }
    }
    await prisma.vehicle.update({
        where: {
            id: id
        },
        data: {
            isVerified: true
        }
    })
    return { msg: "Vehicle Verified Successfully" }
}