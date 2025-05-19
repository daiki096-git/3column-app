import { mailCheckDbModel } from "../../models/user/mailCheckDbModel.mjs";
import jwt from "jsonwebtoken"
import logger from "../../../config/logger.mjs";
import dotenv from "dotenv"
import transporter from "../../../config/mail.mjs";
import { updateTimeDbModel } from "../../models/user/UserDbModel.mjs";

dotenv.config();

export const reconfirmController = async (req, res) => {
    try {
        const address = req.body.address
        const jwt_secret = process.env.SECRET;
        const userResult = await mailCheckDbModel(address);
        if (!userResult) {
            return res.status(404).json({ message: "このメールアドレスは登録されていません" });
        }
        if (userResult[0].status !== "pending") {
            return res.status(400).json({ message: "このアカウントは既に認証済みです" })
        }
        const created_time = userResult[0].created_at;
        const now = new Date();
        const hour = 60 * 60 * 1000;
        if (now - created_time < hour) {
            return res.status(429).json({ message: "確認メールは既に送信されています。メールをご確認ください。" })
        }
        const token = jwt.sign({ userid: userResult[0].userid }, jwt_secret, { expiresIn: "1h" })
        const verificationlink = `${process.env.MAIL_URL}/user_register?token=${token}`;
        await transporter.sendMail(
            {
                from: process.env.MAIL_USER,
                to: address,
                subject: "アカウント認証",
                html: `<p>アカウント検証のため、以下のリンクをクリックしてください。:</p>
               <a href="${verificationlink}">アカウント認証</a>`,
            }
        )

        await updateTimeDbModel(userResult[0].userid, now);
        return res.status(200).json({ message: "確認メールを送信しました。メールから登録を完了させてください。" })
    } catch (error) {
        logger.error("[controller]Error during fetch mailaddress:", error);
        return res.status(500).json({ message: "メール送信に失敗しました" });
    }
}
