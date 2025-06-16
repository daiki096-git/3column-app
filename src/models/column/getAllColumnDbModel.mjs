import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";
export const getAllColumnDbModel=async(id)=>{
    try{
    const [data]=await connection.execute('select * from experience_column where userid=?', [id])
    return {data}
    }catch(error){
        logger.error("[model]Error during database search:", error);
        return
    }
}