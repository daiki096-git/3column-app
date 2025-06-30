 import { getSortDate } from "../../services/getSortDate.mjs";
 import logger from "../../../config/logger.mjs";
 export const getTopController=async(req,res)=>{
 try {
        //更新が必要ない場合は以下を行わない
        if (req.query.flag === undefined) {
            const id = req.session.userid;
            //ページを指定する
            const page=req.query.page||1;
            const newuserData = await getSortDate(id,page)
            req.session.userData={
                date:newuserData.date,
                current:page,
                total:newuserData.total,
            }
        }
        const userData = req.session.userData
        res.render('top.ejs', { date: userData.date, mail:req.session.mail,userid: req.session.userid, filter: false,error:req.query.error,current:userData.current,total:userData.total})
    } catch (error) {
        logger.error("[controller]database get failed:",error)
        res.status(500).json({ message: error.message });
    }
}