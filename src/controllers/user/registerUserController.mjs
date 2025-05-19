import transporter from "../../../config/mail.mjs";
import logger from "../../../config/logger.mjs";
import { mailCheckDbModel } from "../../models/user/mailCheckDbModel.mjs";
import { newUserDbModel } from "../../models/user/UserDbModel.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

//新規ユーザー登録(メール飛ばす)
export const newUserController = async (req, res) => {
  try {
    const jwt_secret = process.env.SECRET;
    const { address, userpassword } = req.body;
    if (address === "" || userpassword === "") return res.status(400).json({ message: "空白があります" })
    const isAvailable = await mailCheckDbModel(address);
    if (isAvailable) {
      return res.status(404).json({ message: "このメールアドレスは既に登録されています" });
    }
    const hash = await bcrypt.hash(userpassword, 10);
    const [rows] = await newUserDbModel(address, hash);
    const token = jwt.sign({ userid: rows.insertId }, jwt_secret, { expiresIn: "1h" })
    const verificationlink = `${process.env.MAIL_URL}/user_register?token=${token}`;
    const mailResult = await transporter.sendMail(
      {
        from: process.env.MAIL_USER,
        to: address,
        subject: "アカウント認証",
        html: `<p>アカウント検証のため、以下のリンクをクリックしてください。:</p>
               <a href="${verificationlink}">アカウント認証</a>`,
      }
    )
    if (!mailResult) {
      return res.status(500).json({ message: "メール送信に失敗しました" });
    }
    return res.status(200).json({ message: "確認メールを送信しました。メールから登録を完了させてください。" })
  } catch (error) {
    logger.error("[controller]Error during fetch mailaddress:", error);
    return res.status(500).json({ message: "メール送信に失敗しました" });
  }
}