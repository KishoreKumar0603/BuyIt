import multer from 'multer';
import { v4 as UUid } from "uuid";

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null,'./uploads')
    },
    filename(req, file, cb){
        const id = UUid();
        const extension = file.originalname.split(".").pop();
        const filename = `${id}.${extension}`;
        cb(null,filename);
    }
});


export const uploadFiles = multer({ storage }).single("image");
