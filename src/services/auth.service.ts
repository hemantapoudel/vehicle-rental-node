import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import jwt from "jsonwebtoken";
import config from "../config/env";

function verificationCodeGen() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateJWTToken (data:{id:string,phone:number}) {
    const token=jwt.sign(data,config.JWT_SECRET);
    return token;
}

export const sendOTP= async (phone: number) => {
    try {
        const code = verificationCodeGen();
        await prisma.otp.create({
            data: {
                phone,
                otp: code,
            },
        });

        const message: string = `Your verification code is ${code}.`;

        await sendSMS(phone, message);

        return "Verification code sent to your phone number";
    } catch (err) {
        throw new CustomError(500, "Internal server error");
    }
}

export const verifyOTP = async (phone: number, otp:number) => {
        const user = await prisma.user.findUnique({
             where:{phone:phone}
        })
        
        const actual_otp = await prisma.otp.findUnique({
            where:{
                phone:phone
            }
        })
        if(!user){
            if(actual_otp && (actual_otp.otp==otp)){
                await prisma.user.create({data:{
                    phone:phone,
                    isVerified:true
                }})
                return "OTP Verified Successfully, fillup personal details"
            } else{
                throw new CustomError(400,"Invalid OTP")
            }
        } else{
            if(actual_otp && (actual_otp.otp==otp)){
                let jwttoken = generateJWTToken({
                    id:user.id,
                    phone:Number(user.phone.toString())
                })
                let loggedInUser = {id:user.id,fullName:user.fullName,phone:user.phone.toString(),email:user.email}
                
                return {token:jwttoken,msg:"Successfully Logged In",user:loggedInUser}
            } else{
                throw new CustomError(400,"Invalid OTP")
            }
        }

        
}




export const registerService = () => {
    
}

