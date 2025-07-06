import express from "express";
import logger from "../../../config/logger.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { requestErrorHandler } from "../../middlewares/errorHandler.mjs";
import { body } from "express-validator";
import { apiAdviceController } from "../../controllers/advice/apiAdviceController.mjs";

const router = express.Router();

router.post('/api/advice',authenticate,
    body('content').notEmpty().withMessage("状況を入力してください"),
    body('feeling_obj').notEmpty().withMessage("気分・感情を入力してください"),
    body('autothink_obj').notEmpty().withMessage("自動思考を入力してください"),
    requestErrorHandler(apiAdviceController))
export default router;

