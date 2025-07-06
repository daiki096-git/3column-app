import { registerController } from '../../controllers/column/registerController.mjs';
import express from 'express';
import { requestErrorHandler } from '../../middlewares/errorHandler.mjs';
import {body} from "express-validator";
import { authenticate } from '../../middlewares/authenticate.mjs';

const router=express.Router();
//3コラ新規登録
router.post('/api/columns',authenticate,
          body('title').notEmpty().withMessage("タイトルを入力してください"),
          body('content').notEmpty().withMessage("状況を入力してください"),
          body('feeling_obj').notEmpty().withMessage("最低1つは気分・感情を入力してください"),
          body('autothink_obj').notEmpty().withMessage("最低1つは自動思考を入力してください"),
          requestErrorHandler(registerController));

export default router;