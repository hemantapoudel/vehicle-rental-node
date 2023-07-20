import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import jwt from "jsonwebtoken";
import config from "../config/env";

function verificationCodeGen() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateJWTToken(data: { id: string, phone: number, role: string }) {
    const token = jwt.sign(data, config.JWT_SECRET);
    return token;
}

export const sendOTP = async (phone: number) => {

    const code = verificationCodeGen();
    let existing_otp = await prisma.otp.findUnique({
        where: {
            phone: phone
        }
    })
    if (!existing_otp) {
        await prisma.otp.create({
            data: {
                phone: phone,
                otp: code,
            },
        });
    }
    await prisma.otp.update({
        where: {
            phone: phone,
        },
        data: {
            otp: code,
        },
    })


    const message: string = `Your verification code is ${code}.`;

    //await sendSMS(phone, message);

    return "Verification code sent to your phone number";

}

export const verifyOTP = async (phone: number, otp: number) => {

    const actual_otp = await prisma.otp.findUnique({
        where: {
            phone: phone
        }
    })

    if (!actual_otp) {
        throw new CustomError(400, "Invalid OTP");
    }

    if (actual_otp.otp !== otp) {
        throw new CustomError(400, "Invalid OTP");
    }

    const user = await prisma.user.findUnique({
        where: { phone: phone }
    })


    if (!user) {
        const [userdata, verifyotp] = await prisma.$transaction([
            prisma.user.create({
                data: {
                    phone: phone,
                    phoneVerified: true,
                },
            }),
            prisma.otp.delete({
                where: {
                    phone: phone
                },
            }),
        ]);

        if (!userdata || !verifyotp) {
            throw new CustomError(500, "Unexpected Server ERROR");
        }

        let jwttoken = generateJWTToken({
            id: userdata.id,
            phone: Number(userdata.phone.toString()),
            role: userdata.role
        })
        return { token: jwttoken, msg: "Successfully Registered ! Fillup Personal Details", isProfileUpdated: userdata.isProfileUpdated, isAddressUpdated: userdata.isAddressUpdated }
    }

    else {
        let jwttoken = generateJWTToken({
            id: user.id,
            phone: Number(user.phone.toString()),
            role: user.role
        })

        await prisma.otp.delete({
            where: {
                phone: phone
            }
        })

        return { token: jwttoken, msg: "Successfully Logged In !", isProfileUpdated: user.isProfileUpdated, isAddressUpdated: user.isAddressUpdated }

    }


}


