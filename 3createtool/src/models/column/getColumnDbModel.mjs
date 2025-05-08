import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"
export const getColumnDbModel=async(id,page)=>{
    try{
    const max_page=10;
    const offset=(page-1)*max_page
    const [data]=await connection.execute(`select * from experience_column where userid=? order by date DESC LIMIT ${max_page} OFFSET ${offset}`, [id])
    const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM experience_column WHERE userid=?`,[id]);
    const total = countResult[0].total; 
    return {data,total}   
}catch(error){
        logger.error("[model]Error during database fetch:",error);
        throw new Error("Database fetch failed")
    }
}