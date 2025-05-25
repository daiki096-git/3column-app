import express from "express";
import session_middle from "../../../config/session.mjs";
import { searchController } from "../../controllers/column/searchController.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { requestErrorHandler } from "../../middlewares/errorHandler.mjs";
import { query } from "express-validator";
import { getYearDateController } from "../../controllers/column/getYearDateController.mjs";

const router = express.Router();
router.use(session_middle);
//タイトルで検索
router.get('/api/columns/title', authenticate,
  query('search').notEmpty().withMessage('検索ワードは必須です'),
  requestErrorHandler(searchController))

//年月で検索
router.get('/api/columns/date',authenticate,getYearDateController)

//検索結果を返す
router.get('/search_result', (req, res) => {
  const searchData = req.session.searchData
  const isFilter=req.query.filter==="true"?true:false;
  if(req.query.message){
    return res.render('top.ejs', { date: searchData.date, userid: searchData.userid ,filter:isFilter,current:req.session.userData.current,total:req.session.userData.total}) 
  }
  res.render('top.ejs', { date: searchData.date,userid:req.session.userid,filter:isFilter,current:req.session.userData.current,total:req.session.userData.total})
})

export default router