import {
    UpdateAddressSchema,
    UpdateProfileSchema,
} from "../schema/user.schema";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export const updateProfile = async (
    userDetails: UpdateProfileSchema,
    loggedInUserData: any,
) => {
    const { fullName, gender, email, profileImage } = userDetails;
    const user = await prisma.user.update({
        where: {
            id: loggedInUserData.id,
        },
        data: {
            fullName: fullName,
            gender: gender,
            email: email,
            profileImage: profileImage,
            isProfileUpdated: true,
        },
    });

    return "Profile Updated Successfully";
};

export const updateAddress = async (
    addressDetails: UpdateAddressSchema,
    loggedInUserData: any,
) => {
    const { province, district, municipality, city, street } = addressDetails;
    const address = await prisma.address.create({
        data: {
            userId: loggedInUserData.id,
            province: province,
            district: district,
            municipality: municipality,
            city: city,
            street: street,
        },
    });
    const user = await prisma.user.update({
        where: {
            id: loggedInUserData.id,
        },
        data: {
            isAddressUpdated: true,
        },
    });

    return "Address Updated Successfully";
};

export const getProfile = async (loggedInUser: any) => {
    const user = await prisma.user.findUnique({
        where: {
            id: loggedInUser.id
        },
        select: {
            fullName: true,
            gender: true,
            phone: true,
            email: true,
            address: true,

        }
    })
    //const userProfile = {id:user?.id,fullName:user?.fullName,phone:user?.phone.toString()}
    return { msg: "Profile fetched", result: { ...user, phone: Number(user?.phone) } }
};




