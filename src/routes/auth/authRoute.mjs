import express from "express";
import logger from "../../../config/logger.mjs";
import session_middle from "../../../config/session.mjs";
import { loginVerifyController } from "../../controllers/auth/loginController.mjs";
import { requestErrorHandler } from "../../middlewares/errorHandler.mjs";
import { body } from "express-validator";

const router = express.Router();
router.use(session_middle);

//ログイン画面に遷移
router.get('/', (req, res) => {
    res.render('login.ejs')
    logger.info(`GET / requested from ${req.ip}`);
})
//ログイン処理
router.post('/api/login',
    body("mail").notEmpty().withMessage("メールアドレスは必須です"),
    body("password").notEmpty().withMessage("パスワードは必須です"),
    requestErrorHandler(loginVerifyController),
)
//ログアウト
router.get('/login', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            logger.error("session destroy failed" + error.message);
            return res.status(500).send("Internal Server Error")
        } else {
            logger.info(`User logged out successfully from ${req.ip}`);
            res.render('login.ejs')
        }
    })
})

export default router