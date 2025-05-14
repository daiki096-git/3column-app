import logger from "../../../config/logger.mjs";
import { activateUserDbModel } from "../../models/user/UserDbModel.mjs";
import dotenv from 'dotenv';
import { verifyjwtToken } from "../../utils/jwt.mjs";
dotenv.config();

//新規ユーザーアカウント妥当性(ユーザー登録)
export const verifyUserController = async (req, res) => {
    try {
      const jwt_secret = process.env.SECRET;  
      const { token } = req.query;
      const decoded=await verifyjwtToken(token,jwt_secret)
      const {userid}=decoded
      const [rows] = await activateUserDbModel(userid)
      if (rows.affectedRows > 0) {
        return res.status(200).send("ユーザー登録に成功しました:ログインページからログインしてください")
      }
      return res.status(404).send("ユーザー登録に失敗しました")
    } catch (error) {
      logger.error("[controller]Error during user verification:", error);
      return res.status(500).send("サーバーエラーが発生しました");
    }
  }
  