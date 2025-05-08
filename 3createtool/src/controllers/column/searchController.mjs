import logger from '../../../config/logger.mjs';
import { searchDbModel } from '../../models/column/searchDbModel.mjs';
import { getSearchDate } from '../../utils/getSearchDate.mjs';

//タイトルで検索
export const searchController = async (req, res) => {
  try {
    const id = req.session.userid;
    const search = `%${req.query.search || ""}%`
    const results = await searchDbModel(id,search)
    if (results[0].length > 0) {

      const data = getSearchDate(results[0], id)
      req.session.searchData = {
        date: data.date
      }
      res.status(200).json({ success: true })
    } else {
      req.session.searchData = {
        date: req.session.userData.date
      }
      res.status(200).json({ message: "検索結果に一致するデータがありませんでした" })
    }
  } catch (error) {
    logger.error("[controller]database connection failed");
    res.status(500).json({ message: "通信エラー" })
  }
}