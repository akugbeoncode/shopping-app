import type multer from "multer";
import type { JwtPayload } from "@devshopapp/common";

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload;
            uploaderError?: Error;
            file?: multer.File;
            files?: multer.File[] | { [fieldname: string]: multer.File[]; };
        }
    }
}

export {};