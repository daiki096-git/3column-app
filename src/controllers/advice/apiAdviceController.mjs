import logger from "../../../config/logger.mjs";
import { getAdviceFromChat } from "../../services/chatgptService.mjs"

export const apiAdviceController=async(req,res)=>{
    try{
    const content=req.body.content;
    const feeling_obj = req.body.feeling_obj;
    const autothink_obj = req.body.autothink_obj;
    const result=await getAdviceFromChat(content,feeling_obj,autothink_obj)
    return res.status(200).json({result})

    }catch(error){
    logger.error("データの取得に失敗しました",error)
    return res.status(500).json({ message: "データの取得に失敗しました" })
    }

}