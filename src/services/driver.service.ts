import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";
import { sendSMS } from "../utils/sms";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { UpdateDriverProfileSchema } from "../schema/driver.schema";
import { calculateDistance } from "../utils/calculateDistance";

function verificationCodeGen() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateJWTToken(data: { id: string; phone: number; role: string }) {
    const token = jwt.sign(data, config.JWT_SECRET);
    return token;
}

export const sendOTP = async (phone: number) => {
    const code = verificationCodeGen();
    let existing_otp = await prisma.otp.findUnique({
        where: {
            phone: phone,
        },
    });
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
    });

    const message: string = `Your verification code is ${code}.`;

    //await sendSMS(phone, message);

    return "Verification code sent to your phone number";
};

export const verifyOTP = async (phone: number, otp: number) => {
    const actual_otp = await prisma.otp.findUnique({
        where: {
            phone: phone,
        },
    });

    if (!actual_otp) {
        throw new CustomError(400, "Invalid OTP");
    }

    if (actual_otp.otp !== otp) {
        throw new CustomError(400, "Invalid OTP");
    }

    const driver = await prisma.vehicleDriver.findUnique({
        where: { phone: phone },
    });

    if (!driver) {
        const [driverdata, verifyotp] = await prisma.$transaction([
            prisma.vehicleDriver.create({
                data: {
                    phone: phone,
                },
            }),
            prisma.otp.delete({
                where: {
                    phone: phone,
                },
            }),
        ]);

        if (!driverdata || !verifyotp) {
            throw new CustomError(500, "Unexpected Server ERROR");
        }

        let jwttoken = generateJWTToken({
            id: driverdata.id,
            phone: Number(driverdata.phone.toString()),
            role: "driver",
        });
        return {
            token: jwttoken,
            msg: "Successfully Registered as driver! Fillup Personal Details",
            isProfileUpdated: driverdata.isProfileUpdated,
        };
    } else {
        let jwttoken = generateJWTToken({
            id: driver.id,
            phone: Number(driver.phone.toString()),
            role: "driver",
        });

        await prisma.otp.delete({
            where: {
                phone: phone,
            },
        });

        return {
            token: jwttoken,
            msg: "Successfully Logged In as driver!",
            isProfileUpdated: driver.isProfileUpdated,
        };
    }
};

export const updateDriverProfile = async (
    userDetails: UpdateDriverProfileSchema,
    loggedInUserData: any,
) => {
    const {
        fullName,
        gender,
        liscenceNo,
        liscencePic,
        liscenceType,
        address,
        photo,
    } = userDetails;
    const user = await prisma.vehicleDriver.update({
        where: {
            id: loggedInUserData.id,
        },
        data: {
            fullName: fullName,
            gender: gender,
            licenseNo: liscenceNo,
            licensePic: liscencePic,
            licenseType: liscenceType,
            photo: photo,
            address: address,
            isProfileUpdated: true,
        },
    });

    return "Driver Profile Updated Successfully";
};

export const viewUnverifiedDrivers = async () => {
    const drivers = await prisma.vehicleDriver.findMany({
        where: {
            isVerified: false,
        },
    });
    drivers.map((driver) => {
        driver.photo = `${config.UPLOADS}/${driver.photo}`;
        return driver;
    });

    let response: Array<any> = [];

    for (let i = 0; i < drivers.length; i++) {
        const driver = drivers[i];

        response.push({
            ...driver,
            phone: Number(driver.phone.toString()),
        });
    }

    return { msg: "Unverified Drivers fetched", result: response };
};

export const verifyDriver = async (id: string) => {
    const driver = await prisma.vehicleDriver.findUnique({
        where: {
            id,
        },
    });
    if (!driver) {
        throw new Error("driver Not Found");
    }
    if (driver.isVerified == true) {
        return { msg: "Driver Already Verified" };
    }
    await prisma.vehicleDriver.update({
        where: {
            id: id,
        },
        data: {
            isVerified: true,
        },
    });
    return { msg: "Driver Verified Successfully" };
};

export const viewIndividualDriver = async (id: string) => {
    const driver = await prisma.vehicleDriver.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            fullName: true,
            gender: true,
            licenseNo: true,
            licensePic: true,
            photo: true,
            isVerified: true,
            isProfileUpdated: true,
            isAvailable: true,
            address: true,
        },
    });
    if (!driver) {
        throw new Error("Driver not found");
    }
    driver.photo = `${config.UPLOADS}/${driver.photo}`;
    driver.licensePic = `${config.UPLOADS}/${driver.licensePic}`;

    return { msg: "Vehicle details", result: driver };
};

export const getDriversNearMe = async (
    lat: number,
    lon: number,
    radius: number,
) => {
    let allDrivers = await prisma.vehicleDriver.findMany({
        where: {
            isVerified: true,
            isAvailable: true,
        },
        select: {
            id: true,
            fullName: true,
            gender: true,
            licenseNo: true,
            licensePic: true,
            photo: true,
            isVerified: true,
            isProfileUpdated: true,
            isAvailable: true,
            address: true,
        },
    });

    let newArr: Array<any> = [];

    for (let i = 0; i < allDrivers.length; i++) {
        const distance = calculateDistance(
            lat,
            lon,
            Number(allDrivers[i].address[0]),
            Number(allDrivers[i].address[1]),
        );

        const newDriverList = {
            ...allDrivers[i],
            distance,
        };

        if (distance <= radius) {
            newArr.push(newDriverList);
        }
    }

    newArr.map((driver) => {
        driver.photo = `${config.UPLOADS}/${driver.photo}`;

        return driver;
    });

    return { msg: "Drivers near fetched", result: newArr };
};
