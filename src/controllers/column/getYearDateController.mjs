import logger from "../../../config/logger.mjs";

export const getYearDateController = async (req, res) => {
    try {
        const userid = req.session.userid;
        const year = req.query.year;
        const month = req.query.month;
        const getDate = req.session.userData
        
        let result={}
        if(month!=="none"){
         const newMonth=String(Number(month))
         result = Object.fromEntries(
            Object.entries(getDate.date).filter(([key]) => key.startsWith(`${year}/${newMonth}/`))
        )}else{
            result = Object.fromEntries(
            Object.entries(getDate.date).filter(([key]) => key.startsWith(`${year}/`))
        )}
        if (!result) return res.status(200).json({ message: "検索結果に一致するデータがありませんでした" })
        req.session.searchData = {
            date: result,
            userid: userid
        }
        res.status(200).json({ success: true })
    } catch (error) {
        logger.error("[controller]database connection failed",error);
        res.status(500).json({ message: "通信エラー" })
    }
}