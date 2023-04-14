
import { ZodArray } from "zod"
import { prisma } from "../utils/db"
export const upload = async (images:any,loggedInUser:any) => {
    const upload = await prisma.upload.create({
        data:{
            images:images,
            userId:loggedInUser.id
        }
    })
    return {msg:"Image Uploaded Successfully", image:upload.images}
}