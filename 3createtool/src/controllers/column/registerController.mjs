import logger from "../../../config/logger.mjs";
import { registerDbModel } from "../../models/column/registerDbModel.mjs";

//3コラ登録
export const registerController = async (req, res) => {
    try {
        const userid = req.session.userid;
        const date = req.body.date;
        const action = req.body.action;
        const realize = req.body.notion;
        const feeling_obj = req.body.feeling_obj;
        const autothink_obj = req.body.autothink_obj;
        const name_title = req.body.title;
        const content = req.body.content;
        const place = req.body.where;
        const withwhom = req.body.who;
        const physical = req.body.physical;
        const success = await registerDbModel(userid, name_title, date, place, withwhom, content, feeling_obj, autothink_obj, physical, action, realize)
        if (!success) {
            logger.error("Database registeration failed.");
            return res.status(500).json({ message: "登録に失敗しました" });
        }
        return res.status(200).json({ message: "登録に成功しました" })
    } catch (error) {
        logger.error("[controller]database connection failed:", error);
        return res.status(500).json({ message: "登録に失敗しました" })
    }
}