import jwt from "jsonwebtoken";
import transporter from "../../../config/mail.mjs";
import logger from "../../../config/logger.mjs";
import { mailCheckDbModel } from "../../models/user/mailCheckDbModel.mjs";
import dotenv from 'dotenv';
dotenv.config();
//新規ユーザー登録(メール飛ばす)
export const newUserController = async (req, res) => {
const jwt_secret = process.env.SECRET;
  try{
  const { address, userpassword } = req.body;
  const isAvailable = await mailCheckDbModel(address);
  if (!isAvailable) {
    return res.status(409).json({ message: "このメールアドレスは既に登録されています" });

  }
  if (address === "" || userpassword === "") return res.status(400).json({ message: "空白があります" })
  const token = jwt.sign({ address, userpassword }, jwt_secret, { expiresIn: "1h" })
  const verificationlink = `${process.env.MAIL_URL}/user_register?token=${token}`;
  transporter.sendMail(
    {
      from: process.env.MAIL_USER,
      to: address,
      subject: "アカウント認証",
      html: `<p>アカウント検証のため、以下のリンクをクリックしてください。:</p>
               <a href="${verificationlink}">アカウント認証</a>`,
    }, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "メール送信に失敗しました" });
      }
      return res.status(200).json({ message: "確認メールを送信しました。メールから登録を完了させてください。" })
    }
  )
}catch(error){
  logger.error("[controller]Error during fetch mailaddress:", error);
  return res.status(500).json({message:"サーバーエラーが発生しました"});

  }

}