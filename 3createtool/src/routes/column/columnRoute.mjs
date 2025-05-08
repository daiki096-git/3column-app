import express from "express";
import { getEditPageController } from "../../controllers/column/getEditPageController.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { getTopController } from "../../controllers/column/getTopController.mjs";

const router = express.Router();

//3コラ新規登録画面へ遷移
router.get('/new_form', (req, res) => {
    const id = req.session.userid;
    res.render('new_form.ejs', { userid: id })
})

//3コラ編集画面に遷移
router.get('/memo/:id', authenticate, getEditPageController);

//3コラ一覧(top)画面に遷移
router.get('/top',getTopController)

export default router
