import { z, TypeOf } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        fullName: z.string({
            required_error: "Full Name is required",
            invalid_type_error: "Full name must be a string",   
        }),

        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Author name must be a string",
        }).email("Invalid Email"),

        gender: z.enum(["male", "female", "other"]),

        profileImage: z.string({
            required_error: "Image is required",
            invalid_type_error: "Invalid image",   
        }),
    }),
});

export const updateAddressSchema = z.object({
    body: z.object({
        province: z.string({
            required_error: "Province is required",  
        }),
        district: z.string({
            required_error: "District is required",  
        }),
        municipality: z.string({
            required_error: "Municipality is required",  
        }),
        city: z.string({
            required_error: "City is required",  
        }),
        street: z.string({
            required_error: "Street is required",  
        }),
    

    }),
});




export type UpdateProfileSchema = TypeOf<typeof updateProfileSchema>["body"];
export type UpdateAddressSchema = TypeOf<typeof updateAddressSchema>["body"];