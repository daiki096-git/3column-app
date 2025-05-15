import { getViewDbModel } from "../../models/column/getViewDbModel.mjs";
import moment from "moment-timezone";
import logger from "../../../config/logger.mjs";
//編集画面取得
export const getEditPageController = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await getViewDbModel(id);
        if (!result||!result.column) {
            logger.error("編集画面に移動できませんでした");
            throw new Error("編集画面取得中にエラーが発生しました");
        }
        const dateInJST = moment(result.column[0].date).tz('Asia/Tokyo').format('YYYY-MM-DD');
        const feels=result.feeling
        const autoThinks=result.autothink
        res.render('memo.ejs', { memo: result.column, feel: feels, autothink: autoThinks, date: dateInJST })
    } catch (error) {
        logger.error("[controller]database fetch failed:",error)
        res.redirect(`/top?error=${true}`)
    }
}