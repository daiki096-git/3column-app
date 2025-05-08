import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";
export const searchDbModel=async(id,search)=>{
    try{
    const result=await connection.execute('select * from experience_column where userid=? and title LIKE ?', [id, search])
    return result
    }catch(error){
        logger.error("[model]Error during database search:", error);
        return
    }
}
