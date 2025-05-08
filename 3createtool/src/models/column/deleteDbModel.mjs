import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs";
export const deleteDbModel=async(id)=>{
try{
        await connection.execute(
        'delete from experience_column where id=?',
        [id]);
        return true;
    }catch(error){
        logger.error("[model]Error during database delete:", error);
        return false
    
    }
 
};
