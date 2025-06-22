import express from "express";
import logger from "../../../config/logger.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { requestErrorHandler } from "../../middlewares/errorHandler.mjs";
import { body } from "express-validator";
import { apiAdviceController } from "../../controllers/advice/apiAdviceController.mjs";

const router = express.Router();

router.post('/api/advice',authenticate,
    body('content').notEmpty().withMessage("状況を入力してください"),
    body('action').notEmpty().withMessage("その時の実際の行動を入力してください"),
    requestErrorHandler(apiAdviceController))
export default router;

