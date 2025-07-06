import logger from "../../../config/logger.mjs";
import { updateDbModel } from "../../models/column/updateDbModel.mjs";

//3コラ更新
export const updateController = async (req, res) => {
    try {
        const id = req.params.id;
        const date = req.body.date;
        const title = req.body.title;
        const place = req.body.where||"";
        const who = req.body.who||"";
        const content = req.body.content;
        const feeling_obj = req.body.feeling_obj;
        const autothink_obj = req.body.autothink_obj;
        const physical = req.body.physical||"";
        const action = req.body.action||"";
        const notion = req.body.notion||"";
        const result = await updateDbModel(date, title, place, who, content, feeling_obj, autothink_obj, physical, action, notion, id)
        if (!result) {
            logger.error("Database update failed.");
            return res.status(500).json({ message: "更新に失敗しました" });

        }
        return res.status(200).send({ message: "更新ができました" })
    } catch (error) {
        logger.error("[controller]database connection failed:", error);
        return res.status(500).json({ message: "更新に失敗しました" })
    }
}