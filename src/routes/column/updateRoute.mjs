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
    body('date').notEmpty(),
    body('who').notEmpty(),
    body('where').notEmpty(),
    body('physical').notEmpty(),
    body('action').notEmpty(),
    requestErrorHandler(updateController))

export default router;