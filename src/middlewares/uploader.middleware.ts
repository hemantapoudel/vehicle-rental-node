const multer = require("multer");
import * as path from 'path';
const { v4: uuidv4 } = require('uuid');

const myStorage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        let uploadpath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadpath)
    },
    filename: (req: any, file: any, cb: any) => {

        let filename = uuidv4() + "." + file.originalname.split(".").pop();
        cb(null, filename);
    },

})

const uploader = multer({
    storage: myStorage,
    fileFilter: (req: any, file: any, cb: any) => {
        let ext_parts = file.originalname.split(".");
        let ext = ext_parts.pop();

        try {
            let allowed = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'pdf'];
            if (allowed.includes(ext.toLowerCase())) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    },

});


module.exports = uploader;