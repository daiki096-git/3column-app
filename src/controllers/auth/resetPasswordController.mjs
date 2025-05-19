import { verifyjwtToken } from "../../utils/jwt.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../../../config/mail.mjs";
import logger from "../../../config/logger.mjs";
import { getAddressDbModel, updatePasswordDbModel } from "../../models/user/UserDbModel.mjs";
import dotenv from 'dotenv';
dotenv.config();
const jwt_secret = process.env.SECRET;

//パスワード忘れた場合、メール送信(メールアドレス確認)
export const verifyMailController = async (req, res) => {
  try {
    const mailaddress = req.body.address;
    const result = await getAddressDbModel(mailaddress)
    if (result[0].length === 0) return res.status(400).json({ message: "入力されたメールアドレスは登録されていません" })
    const token = jwt.sign({ mailaddress }, jwt_secret, { expiresIn: "1h" })
    const verificationlink = `${process.env.MAIL_URL}/modify_user?token=${token}`;
    await transporter.sendMail(
      {
        from: process.env.MAIL_USER,
        to: mailaddress,
        subject: "ユーザー名またはパスワード再設定",
        html: `<p>以下のリンクをクリックしてユーザー名とパスワードを再設定してください:</p>
                       <a href="${verificationlink}">アカウント再設定</a>`,
      })
    return res.status(200).json({ message: "アカウント再登録フォームをメールアドレスに送信しました" })
  } catch (error) {
    logger.error("Error during fetch mailaddress:", error);
    return res.status(500).json({ message: "メール送信に失敗しました" });
  }
}

//パスワード再登録画面取得(パスワード忘れた場合)
export const getPasswordPageController = async (req, res) => {
  const token = req.query.token;
  const decoded = await verifyjwtToken(token, jwt_secret);
  const mail_address = decoded.mailaddress;
  res.render('modify_newuser.ejs', { mailaddress: mail_address });
}

//パスワード再登録
export const newPasswordController = async (req, res) => {
  try {
    const { password, address } = req.body;
    const hash = await bcrypt.hash(password, 10)
    const [rows] = await updatePasswordDbModel(hash, address)
    if (rows.affectedRows > 0) {
      return res.status(200).json({ message: "アカウント登録に成功しました" })
    }
    return res.status(400).json({ message: "入力されたメールアドレスは存在しません" })
  } catch (error) {
    logger.error("[controller]Error during database update:", error);
    return res.status(500).json({ message: "アカウント更新に失敗しました" })
  }
}