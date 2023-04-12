import { AddBrandSchema, AddCategorySchema, AddSubCategorySchema } from "../schema/vehicle.schema";
import { prisma } from "../utils/db";




export const addCategory = async (categoryDetails:AddCategorySchema) => {
    const {title, description, logo} = categoryDetails
    const category = await prisma.category.create({
        data:{
            title,
            description,
            logo
        }
    })
    return {msg:"Category added",result:category}
}

export const addSubCategory = async (subCategoryDetails:AddSubCategorySchema) => {
    const {title, description,categoryId, logo} = subCategoryDetails
    const subCategory = await prisma.subCategory.create({
        data:{
            title,
            description,
            logo,
            categoryId
        }
    })
    return {msg:"Category added",result:subCategory}
}

export const addBrand = async (brandDetails:AddBrandSchema) => {
    const {title, description,logo} = brandDetails
    const brand = await prisma.brand.create({
        data:{
            title,
            description,
            logo
        }
    })
    return {msg:"Brand added",result:brand}
}