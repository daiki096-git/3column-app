vi.mock("../../../config/db.mjs",()=>({
    default:{
        execute:vi.fn()
    }
}))
vi.mock('../../../config/logger.mjs',()=>({
    default: {
    error:vi.fn()
    }
}))

import {vi,beforeEach,describe,it, expect} from "vitest"
import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";
import { mailCheckDbModel } from "../../../src/models/user/mailCheckDbModel.mjs";

describe('mailCheckDbModel',()=>{
beforeEach(()=>{
    vi.clearAllMocks()
})
const mockResponse=[[{"userid":1,"mailaddress":"test@example.com","password":"hashpassword","status":"active","created_at":"2025-01-01"}],[]]
const emptyResponse=[[],[]]
const address="test@example.com";
it("アドレスが見つかったとき",async()=>{  
    connection.execute.mockResolvedValue([mockResponse])
    const result=await mailCheckDbModel(address)
    expect(connection.execute).toHaveBeenCalledWith('select * from users where mailaddress=?', [address])
    expect(result).toEqual(mockResponse)
})
it("アドレスが見つからなかったとき",async()=>{
    connection.execute.mockResolvedValue(emptyResponse)
    const result=await mailCheckDbModel(address)
    expect(connection.execute).toHaveBeenCalledWith('select * from users where mailaddress=?', [address])
    expect(result).toBe(false)
})
it("処理が失敗したとき(サーバエラー)",async()=>{
    const error=new Error("DB connection error")
    connection.execute.mockRejectedValue(error)
    await expect(mailCheckDbModel(address)).rejects.throw(
        "database fetch failed"
    )
    expect(logger.error).toHaveBeenCalledWith("Error during database fetch:", error)
})
})
