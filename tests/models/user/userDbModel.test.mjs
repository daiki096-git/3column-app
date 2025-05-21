vi.mock("../../../config/logger.mjs",()=>({
    default:{
        error:vi.fn()
    }
}))
vi.mock("../../../config/db.mjs",()=>({
    default:{
        execute:vi.fn()
    }
}))
import {vi,expect,beforeEach,describe,it} from "vitest"
import { newUserDbModel,getAddressDbModel,updatePasswordDbModel,activateUserDbModel,updateTimeDbModel} from "../../../src/models/user/UserDbModel.mjs"
import logger from "../../../config/logger.mjs"
import connection from "../../../config/db.mjs"

describe("newUserDbModel",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    const hash="hashedPassword"
    const address="test@example.com"
    const result=[[{}],[]]
    it("処理が成功したとき",async()=>{
        connection.execute.mockResolvedValue(result)
        await newUserDbModel(address,hash)
        expect(connection.execute).toHaveBeenCalledWith('insert into users (mailaddress,password,status) values (?,?,?)', [address, hash, "pending"])
    })
    it("処理が失敗したとき",async()=>{
        const error=new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(newUserDbModel(address,hash)).rejects.throw(
            "database registration failed"
        )
        expect(logger.error).toHaveBeenCalledWith("Error during database registration:", error)
    })

})
describe("getAddessDbModel",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    const mailaddress="test@example.com"
    const mockResponse=[[{"userid":1,"mailaddress":"test@example.com","password":"hashpassword","status":"active","created_at":"2025-01-01"}],[]]
    it("処理が成功したとき",async()=>{
        connection.execute.mockResolvedValue(mockResponse)
        const result=await getAddressDbModel(mailaddress)
        expect(connection.execute).toHaveBeenCalledWith('select * from users where mailaddress=?', [mailaddress])
        expect(result).toEqual(mockResponse)
    })
    it("処理が失敗したとき",async()=>{
        const error=new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(getAddressDbModel(mailaddress)).rejects.throw(
            "database fetch failed"
        )
        expect(logger.error).toHaveBeenCalledWith("Error during database fetch:", error)
    })
})
describe("updatePasswordDbModel",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    const hash="hashedPassword"
    const address="test@example.com"
    const result=[[{}],[]]
    it("処理が成功したとき",async()=>{
        connection.execute.mockResolvedValue(result)
        await updatePasswordDbModel(hash,address)
        expect(connection.execute).toHaveBeenCalledWith('update users set password=? where mailaddress=?', [hash, address])
    })
    it("処理が失敗したとき",async()=>{
        const error=new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(updatePasswordDbModel(address,hash)).rejects.throw(
            "database update failed"
        )
        expect(logger.error).toHaveBeenCalledWith("Error during database update:", error)
    })
})
describe("activateUserDbModel",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    const userid=1
    const result=[[{}],[]]
    it("処理が成功したとき",async()=>{
        connection.execute.mockResolvedValue(result)
        await activateUserDbModel(userid)
        expect(connection.execute).toHaveBeenCalledWith('update users set status=? where userid=?', ["active", userid])
    })
    it("処理が失敗したとき",async()=>{
        const error=new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(activateUserDbModel(userid)).rejects.throw(
            "database update failed"
        )
        expect(logger.error).toHaveBeenCalledWith("Error during database update:", error)
    })
})
describe("updateTimeDbModel",()=>{
    beforeEach(()=>{
        vi.clearAllMocks()
    })
    const userid=1
    const now="2025-05-09"
    const result=[[{}],[]]
    it("処理が成功したとき",async()=>{
        connection.execute.mockResolvedValue(result)
        await updateTimeDbModel(userid,now)
        expect(connection.execute).toHaveBeenCalledWith('update users set created_at=? where userid=?', [now,userid])
    })
    it("処理が失敗したとき",async()=>{
        const error=new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(updateTimeDbModel(userid)).rejects.throw(
            "database update failed"
        )
        expect(logger.error).toHaveBeenCalledWith("Error during database update:", error)
    })
})

