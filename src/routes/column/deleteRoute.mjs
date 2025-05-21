import { deleteController } from '../../controllers/column/deleteController.mjs';
import express from 'express';
import { authenticate } from '../../middlewares/authenticate.mjs';

const router = express.Router();
//3コラ削除
router.delete('/api/columns/:id', authenticate,deleteController);

export default router;