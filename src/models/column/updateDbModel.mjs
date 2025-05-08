import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"

export const updateDbModel=async(date, title, place, who, content, feeling_obj,autothink_obj, physical, action, notion, id)=>{
    const con=await connection.getConnection();
    try{
    con.beginTransaction()
     await con.execute('update experience_column set date=?,title=?,place=?,who=?,content=?,physical=?,action=?,realize=? where id=?',
            [date, title, place, who, content, physical, action, notion, id])
    await con.execute('delete from feelings where experience_id=?',[id])
    await con.execute('delete from autothinks where experience_id=?',[id])
        const feelingValue = Object.keys(feeling_obj).map((feeling) => {
            const feeling_per = parseInt(feeling_obj[feeling])
            return [feeling, feeling_per, id]
        });
        const autothinkValue = Object.keys(autothink_obj).map((autothink) => {
            const autothink_per = parseInt(autothink_obj[autothink])
            return [autothink, autothink_per,id]
        });
        await con.query(
            'insert into feelings (feeling,feelingPer,experience_id) values ?',
             [feelingValue]
        )
        await con.query(
            'insert into autothinks (autoThink,autoThinkPer,experience_id) values ?',
            [autothinkValue]
        )
    
        await con.commit();
        return true
        
    
    
}catch(error){
    await con.rollback()
    logger.error("[model]Error during database update:", error);
    return false
   }finally{
    con.release();
   }
}
