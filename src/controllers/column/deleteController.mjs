import { deleteDbModel } from "../../models/column/deleteDbModel.mjs";
import logger from "../../../config/logger.mjs";

//3コラ削除
export const deleteController = async (req, res) => {
    try {
        const id = req.params.id;
        const success = await deleteDbModel(id);
        if (!success) {
            logger.error("Database delete failed");
            return res.status(500).json({ message: "削除に失敗しました" });

        }
        return res.status(200).json({ message: "削除に成功しました" })

    } catch (error) {
        logger.error("[controller]database connection failed", error)
        return res.status(500).json({ message: "削除に失敗しました" })

    }

}
