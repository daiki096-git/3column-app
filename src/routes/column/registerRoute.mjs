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
          body('date').notEmpty().withMessage("日付を選択してください"),
          body('where').notEmpty().withMessage("いつの出来事か入力してください"),
          body('who').notEmpty().withMessage("誰との出来事か入力してください"),
          body('physical').notEmpty().withMessage("身体的反応を入力してください"),
          body('action').notEmpty().withMessage("その時の実際の行動を入力してください"),
          requestErrorHandler(registerController));

export default router;