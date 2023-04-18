import { CustomError } from "../utils/custom_error";
import { prisma } from "../utils/db"


export const booking = async (vehicleId:string,loggedInUser:any,startDate:Date,endDate:Date) => {
    let alreadyBooked = await prisma.booking.findUnique({
        where:{
            vehicleId:vehicleId
        }
    })

    if(alreadyBooked){
        throw new CustomError(400, "Vehicle Already Booked");
    }

    const [booking,update] = await prisma.$transaction([
        prisma.booking.create({
            data:{
                vehicleId:vehicleId,
                bookedById:loggedInUser.id,
                startDate:startDate,
                endDate:endDate,
                description:"booked"
            }
        }),
        prisma.vehicle.update({
            where:{
                id:vehicleId
            },
            data:{
                isBooked:true
            }
        })
    ])
    return "Vehicle Booked"
}


