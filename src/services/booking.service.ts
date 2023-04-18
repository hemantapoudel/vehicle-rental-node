import exp from "constants";
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
    return "Vehicle Booked";
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
    return "Booking cancelled";
};

export const deleteExpiredBookings = async (): Promise<void> => {
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
