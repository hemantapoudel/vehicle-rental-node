import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export const updateProfile = async (data:{fullname:string,email:string,gender:string}) => {
    const user = await prisma.user.findUnique({
        where: {
            
        }
    
    })
}

export const updateAddress = (data:{fullname:string,}) => {

}
