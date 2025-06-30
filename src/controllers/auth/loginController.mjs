import bcrypt from "bcrypt";
import logger from "../../../config/logger.mjs";
import { getAddressDbModel } from "../../models/user/UserDbModel.mjs";
import { getSortDate } from "../../services/getSortDate.mjs";

//ログイン認証
export const loginVerifyController = async (req, res) => {
    try {
      const mail = req.body.mail;
      req.session.mail=mail
      const password = req.body.password;
      const results = await getAddressDbModel(mail)
      if (results[0].length === 0) {
        return res.status(401).json({ message: "ユーザーが見つかりません" });
      }
      if(results[0][0].status==="pending"){
        return res.status(400).json({ message: "ユーザー認証が完了していません。メールから認証を完了させてください。" });
      }
      const isEqual = await bcrypt.compare(password, results[0][0].password)
      if (!isEqual) {
        return res.status(401).json({ message: "認証に失敗しました" });
      }
      const id = results[0][0].userid;
      req.session.userid = results[0][0].userid;
      const page=1
      const result = await getSortDate(id,page);
      req.session.userData = {
        mail:mail,
        date: result.date,
        current:page,
        userid: result.userid,
        total:result.total
      }
      res.status(200).json({ message: "ログイン成功" })
    } catch (error) {
      logger.error("[controller]認証に失敗しました:",error);
      res.status(500).json({ message: "ログインに失敗しました", error: error.message });
    }
  }