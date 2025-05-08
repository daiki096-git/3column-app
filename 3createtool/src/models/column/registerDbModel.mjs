import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";
export const registerDbModel = async (userid, name_title, date, place, withwhom, content, feeling_obj, autothink_obj, physical, action, realize) => {
    const con = await connection.getConnection();
    try{
    await con.beginTransaction();
    const result = await con.execute(
        'insert into experience_column (userid,title,date,place,who,content,physical,action,realize) values (?,?,?,?,?,?,?,?,?)',
        [userid, name_title, date, place, withwhom, content, physical, action, realize])

    const experience_id = result[0].insertId;
    const feelingValue = Object.keys(feeling_obj).map((feeling) => {
        const feeling_per = parseInt(feeling_obj[feeling])
        return [feeling, feeling_per, experience_id]
    });
    const autothinkValue = Object.keys(autothink_obj).map((autothink) => {
        const autothink_per = parseInt(autothink_obj[autothink])
        return [autothink, autothink_per, experience_id]
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
    logger.error("[model]Error during database registration:", error);
    return false

   }finally{
    con.release();
   }


}
