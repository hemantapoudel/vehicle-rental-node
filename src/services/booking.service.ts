import config from "../config/env";
import { EnumValues } from "zod";
import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db";

export const booking = async (
    vehicleId: string,
    loggedInUser: any,
    startDate: Date,
    endDate: Date,
) => {
    let alreadyBooked = await prisma.booking.findUnique({
        where: {
            vehicleId: vehicleId,
        },
    });
    if (alreadyBooked) {
        throw new CustomError(400, "Vehicle Already Booked");
    }

    const [booking, update] = await prisma.$transaction([
        prisma.booking.create({
            data: {
                vehicleId: vehicleId,
                bookedById: loggedInUser.id,
                startDate: startDate,
                endDate: endDate,
                description: "booked",
            },
        }),
        prisma.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                isBooked: true,
            },
        }),
    ]);
    return { msg: "Vehicle Booked" };
};

export const cancelBooking = async (vehicleId: string, loggedInUser: any) => {
    let booked = await prisma.booking.findUnique({
        where: {
            vehicleId: vehicleId,
        },
    });

    if (!booked) {
        throw new CustomError(400, "Booking already cancelled");
    }
    if (booked?.bookedById != loggedInUser.id) {
        throw new CustomError(401, "Unauthorized Access");
    }
    const [cancelBooking, update] = await prisma.$transaction([
        prisma.booking.delete({
            where: {
                vehicleId: vehicleId,
            },
        }),
        prisma.vehicle.update({
            where: {
                id: vehicleId,
            },
            data: {
                isBooked: false,
            },
        }),
    ]);
    return { msg: "Booking cancelled" };
};

export const deleteExpiredBookings = async () => {
    const currentDate = new Date();
    const expiredBookings = await prisma.booking.findMany({
        where: {
            endDate: {
                lte: currentDate,
            },
        },
    });

    await Promise.all(
        expiredBookings.map(async (booking) => {
            await prisma.$transaction([
                prisma.vehicle.update({
                    where: {
                        id: booking.vehicleId,
                    },
                    data: {
                        isBooked: false,
                    },
                }),
                prisma.booking.delete({
                    where: {
                        id: booking.id,
                    },
                }),
            ]);
        }),
    );
};

export const myBookings = async (loggedInUser: any) => {
    let myBookings = await prisma.booking.findMany({
        where: {
            bookedById: loggedInUser.id,
        },
        select: {
            id: true,
            Vehicle: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    vehicleNumber: true,
                },
            },
            startDate: true,
            endDate: true,
            status: true,
        },
    });
    const result = myBookings.map((bookingRequest) => ({
        id: bookingRequest.id,
        thumbnail: `${config.UPLOADS}/${bookingRequest.Vehicle.thumbnail}`,
        vehicle: bookingRequest.Vehicle,
        startDate: bookingRequest.startDate,
        endDate: bookingRequest.endDate,
        status: bookingRequest.status,
    }));
    return { msg: "Bookings fetched", result: result };
};

export const myBookingRequests = async (loggedInUser: any) => {
    let bookingRequests = await prisma.booking.findMany({
        where: {
            Vehicle: {
                addedById: loggedInUser.id,
            },
        },
        select: {
            id: true,
            Vehicle: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    images: true

                },
            },
            startDate: true,
            endDate: true,
            status: true,
        },
    });

    const result = bookingRequests.map((bookingRequest) => ({
        id: bookingRequest.id,
        thumbnail: `${config.UPLOADS}/${bookingRequest.Vehicle.thumbnail}`,
        vehicle: bookingRequest.Vehicle,
        startDate: bookingRequest.startDate,
        endDate: bookingRequest.endDate,
        status: bookingRequest.status,
    }));
    return { msg: "Booking Requests fetched", result: result };
};

export const acceptOrRejectBooking = async (
    loggedInUser: any,
    status: any,
    id: string,
) => {
    let update = await prisma.booking.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return { msg: `Booking ${status}` };
};