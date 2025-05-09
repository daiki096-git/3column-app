import bcrypt from "bcrypt";
import logger from "../../../config/logger.mjs";
import { getAddressDbModel } from "../../models/user/UserDbModel.mjs";
import { getSortDate } from "../../services/getSortDate.mjs";

//ログイン認証
export const loginVerifyController = async (req, res) => {
    try {
      const mail = req.body.mail;
      const password = req.body.password;
      const results = await getAddressDbModel(mail)
      if (results[0].length === 0) {
        return res.status(401).json({ message: "ユーザーが見つかりません" });
      }
      const isEqual = await bcrypt.compare(password, results[0][0].password)
      if (!isEqual) {
        return res.status(401).json({ message: "認証に失敗しました" });
      }
      const id = results[0][0].userid;
      req.session.userid = results[0][0].userid;
      let page=1
      if(req.query.page!==undefined||req.query.page!==undefined){
        page=req.query.page
      }
      const result = await getSortDate(id,page);
      req.session.userData = {
        date: result.date,
        current:page,
        userid: result.userid,
        total:result.total
      }
      res.status(200).json({ message: "ログイン成功" })
    } catch (error) {
      logger.error(`[controller]認証に失敗しました: ${error.message}`);
      res.status(500).json({ message: "ログインに失敗しました", error: error.message });
    }
  }