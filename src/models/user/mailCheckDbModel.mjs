import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"

export const mailCheckDbModel = async (address) => {
    try {
        const result = await connection.execute('select * from users where mailaddress=?', [address])
        if (result[0].length > 0) {
            return false
        }
        return true
    } catch (error) {
        logger.error("Error during database fetch:", error);
        throw new Error("database fetch failed")
    }
}