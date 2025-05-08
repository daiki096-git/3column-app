import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"

//ユーザー新規登録
export const newUserDbModel=async(address,hash)=>{
    try{
    return await connection.execute('insert into users (mailaddress,password) values (?,?)', [address, hash])
    }catch(error){
    logger.error("Error during database registration:", error);
    throw new Error("database registration failed");

    }
}

//登録済みメールアドレスの確認
export const getAddressDbModel=async(mailaddress)=>{
   try{
   return await connection.execute('select * from users where mailaddress=?', [mailaddress])
   }catch(error){
    logger.error("Error during database fetch:", error);
    throw new Error("database fetch failed")
   }
}

//パスワード再設定
export const updatePasswordDbModel=async(hash,address)=>{
   try{ 
    return await connection.execute('update users set password=? where mailaddress=?', [hash, address])
   }catch(error){
    logger.error("Error during database update:", error);
    throw new Error("database update failed")
   }
}