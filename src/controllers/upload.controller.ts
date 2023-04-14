import { NextFunction, Request, Response } from "express";
import { upload } from "../services/upload.service";
interface MulterFile extends Express.Multer.File {}

export async function uploadController(
    req: Request<{}, {}, { images: any }>,
    res: Response,
    next: NextFunction,
) {
    try {
        let images = req.files as MulterFile[] | undefined;
        const imageArr = images?.map(myFunction);
        function myFunction(file: MulterFile) {
            return file.filename;
        }
        const response = await upload(imageArr, res.locals.user);
        return res.status(201).json({ success: true, data: response });
    } catch (e: any) {
        next(e);
    }
}
