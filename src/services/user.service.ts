import { UpdateAddressSchema, UpdateProfileSchema } from "../schema/user.schema";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export const updateProfile = async (userDetails:UpdateProfileSchema,loggedInUserData:any) => {
    const { fullName, gender, email, profileImage } = userDetails
    const user = await prisma.user.update({
        where: {
            id:loggedInUserData.id,
        },
        data: {
            fullName:fullName,
            gender:gender,
            email:email,
            profileImage:profileImage,
            isProfileUpdated: true,
        },
    });
    return "Profile Updated Successfully"
}

export const updateAddress = async (addressDetails:UpdateAddressSchema,loggedInUserData:any) => {
    const {province,district,municipality,city,street} = addressDetails;
    const address = await prisma.address.create({
        data: {
            userId:loggedInUserData.id,
            province:province,
            district:district,
            municipality:municipality,
            city:city,
            street:street
        },
    })
}
