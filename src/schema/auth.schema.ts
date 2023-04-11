import { z, TypeOf } from "zod";

export const sendOTPSchema = z.object({
    body: z.object({
        phone: z.string().refine((value) => value.toString().length === 10, {
            message: "Phone Number must be 10 digits",
        }),
    }),
});

export const verifyOTPSchema = z.object({
    body: z.object({
        phone: z.string().refine((value) => value.toString().length === 10, {
            message: "Phone Number must be 10 digits",
        }),
        otp: z.string(),
    }),
});



export type SendOTPSchema = TypeOf<typeof sendOTPSchema>["body"];
export type VerifyOTPSchema = TypeOf<typeof verifyOTPSchema>["body"];
