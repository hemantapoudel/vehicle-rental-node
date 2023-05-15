import { z, TypeOf } from "zod";

export const updateDriverProfileSchema = z.object({
    body: z.object({
        fullName: z.string({
            required_error: "Full Name is required",
            invalid_type_error: "Full name must be a string",   
        }),
        gender: z.enum(["male", "female", "other"]),

        photo: z.string({
            required_error: "Image is required",
            invalid_type_error: "Invalid image",   
        }),
        liscenceType: z.string({
            required_error: "Liscence type is required",
            invalid_type_error: "Invalid no",   
        }),
        liscenceNo: z.string({
            required_error: "Liscence NO is required",
            invalid_type_error: "Invalid no",   
        }),
        liscencePic: z.string({
            required_error: "Liscence pic is required",
            invalid_type_error: "Invalid liscence",   
        }),
        address: z.string({
            required_error: "Pickup Address is required",
            invalid_type_error: "Pickup Address must be a string",
        })
        .array()
        .length(2),

    }),
});







export type UpdateDriverProfileSchema = TypeOf<typeof updateDriverProfileSchema>["body"];
