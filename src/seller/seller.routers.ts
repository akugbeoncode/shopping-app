import { Router } from 'express';

import { addProductImagesController, createProductController, deleteProductController, deleteProductImagesController, updateProductController } from './seller.controllers.js';
import { requireAuth, Uploader, UPLOADS_DIRECTORY, type UploadOptions } from '@devshopapp/common';

const uploader = new Uploader(UPLOADS_DIRECTORY);
const middlewareOptions: UploadOptions = {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    maxFiles: 5,
    uploadDirectory: 'uploads/products'
};

const uploadMiddleware = uploader.uploadMultipleFiles(middlewareOptions);


const router = Router();

router.post('/api/products', requireAuth, uploadMiddleware, createProductController);
router.post('/api/products/:id/add-images', requireAuth, uploadMiddleware, addProductImagesController);
router.post('/api/products/:id/delete-images', requireAuth, deleteProductImagesController);
router.put('/api/products/:id', requireAuth, updateProductController);
router.delete('/api/products/:id', requireAuth, deleteProductController);

export { router as sellerRouter }