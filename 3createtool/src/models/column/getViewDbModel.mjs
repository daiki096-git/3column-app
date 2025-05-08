import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"
export const getViewDbModel = async (id) => {
       try {
              const [column]=await connection.execute('select * from experience_column where id=?',[id])
              const [feeling]=await connection.execute('select * from feelings where experience_id=?',[id])
              const [autothink]=await connection.execute('select * from autothinks where experience_id=?',[id])
              return {column,feeling,autothink}
       } catch (error) {
              logger.error("[model]Error during database getPage:", error);
              throw new Error("データベースの取得に失敗しました")
       }
}
