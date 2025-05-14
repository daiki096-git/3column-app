import express from "express";
import { newUserController } from "../../controllers/user/registerUserController.mjs";
import { verifyUserController } from "../../controllers/user/verifyUserController.mjs";
import { verifyMailController } from "../../controllers/auth/resetPasswordController.mjs";
import { getPasswordPageController } from "../../controllers/auth/resetPasswordController.mjs";
import { newPasswordController } from "../../controllers/auth/resetPasswordController.mjs";
import { requestErrorHandler } from "../../middlewares/errorHandler.mjs";
import { body } from "express-validator";
import { reconfirmController } from "../../controllers/user/reconfirmController.mjs";

const router = express.Router();

//新規ユーザー登録
router.post('/send-email',
  body("address")
    .notEmpty().withMessage("メールアドレスは必須です")
    .isEmail().withMessage("無効なメールアドレス形式です"),
  body("userpassword")
    .notEmpty().withMessage("パスワードは必須です")
    .isLength({ min: 8, max: 20 }).withMessage("パスワードは8文字以上20文字以下を入力してください")
    .matches(/[A-Z]/).withMessage("パスワードは少なくとも1つの大文字を含んでください")
    .matches(/[a-z]/).withMessage("パスワードは少なくとも1つの小文字を含んでください")
    .matches(/\d/).withMessage("パスワードは少なくとも1つの数字を含んでください"),
  requestErrorHandler(newUserController))

//ユーザー新規登録画面に遷移
router.get('/new_user', (req, res) => {
  res.render('new_user.ejs')
})

//ユーザーアカウント再登録画面へ遷移(パスワード忘れた場合)
router.get('/user_forget', (req, res) => {
  res.render('user_forget.ejs')
})

//新規ユーザーアカウント妥当性確認
router.get('/user_register/', verifyUserController)

//パスワード再登録のためのアカウント(メールアドレス)確認処理
router.post('/send_newuser',
  body("address")
    .notEmpty().withMessage("メールアドレスは必須です")
    .isEmail().withMessage("無効なメールアドレス形式です"),
  requestErrorHandler(verifyMailController))

//パスワード再登録画面取得
router.get('/modify_user', getPasswordPageController)

//パスワード再登録
router.post('/user_again_register',
  body("password").notEmpty().withMessage("パスワードは必須です")
    .isLength({ min: 8, max: 20 }).withMessage("パスワードは8文字以上20文字以下を入力してください")
    .matches(/[A-Z]/).withMessage("パスワードは少なくとも1つの大文字を含んでください")
    .matches(/[a-z]/).withMessage("パスワードは少なくとも1つの小文字を含んでください")
    .matches(/\d/).withMessage("パスワードは少なくとも1つの数字を含んでください"),
  requestErrorHandler(newPasswordController))

//メール再送画面取得
router.get('/resend_email',(req,res)=>{
  res.render('resend_email.ejs')
})

//メール再送処理
router.post('/reconfirm_account',
  body("address")
    .notEmpty().withMessage("メールアドレスは必須です")
    .isEmail().withMessage("無効なメールアドレス形式です"),
  requestErrorHandler(reconfirmController))


export default router