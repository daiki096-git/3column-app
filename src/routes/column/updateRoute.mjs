import { updateController } from '../../controllers/column/updateController.mjs';
import express from 'express';
import { requestErrorHandler } from '../../middlewares/errorHandler.mjs';
import { body } from "express-validator";
import { authenticate } from '../../middlewares/authenticate.mjs';

const router = express.Router();
//3コラ更新
router.put('/api/columns/:id',authenticate,
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('feeling_obj').notEmpty(),
    body('autothink_obj').notEmpty(),
    requestErrorHandler(updateController))

export default router;