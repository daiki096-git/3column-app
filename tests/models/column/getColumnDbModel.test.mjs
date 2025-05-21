vi.mock("../../../config/db.mjs", () => ({
    default: {
        execute: vi.fn()
    }
}))
vi.mock("../../../config/logger.mjs", () => ({
    default: {
        error: vi.fn()
    }
}))
import { describe, it, expect, vi, beforeEach } from "vitest"
import { getColumnDbModel } from "../../../src/models/column/getColumnDbModel.mjs"
import connection from "../../../config/db.mjs"
import logger from "../../../config/logger.mjs"

describe('getColumnDbModel', () => {
    const mockId = "1"
    const max_page = 10
    const page = 1
    beforeEach(() => {
        vi.clearAllMocks();
    })
    it("処理が成功した場合", async () => {
        const mockData = [{}, {}]
        const mockCount = 15
        connection.execute
        .mockResolvedValueOnce([mockData,[]])
        .mockResolvedValueOnce([[{ total: mockCount }],[]])
        const result = await getColumnDbModel(mockId, page)
        expect(connection.execute).toHaveBeenCalledWith(
            `select * from experience_column where userid=? order by date DESC LIMIT ${max_page} OFFSET ${(page - 1) * max_page}`,
            [mockId]
        )
        expect(connection.execute).toHaveBeenCalledWith(
            `SELECT COUNT(*) as total FROM experience_column WHERE userid=?`,
            [mockId]
        )
        expect(result).toEqual({data:mockData, total:mockCount})
    })
    it("処理が失敗した場合", async () => {
        const error = new Error("DB connection error")
        connection.execute.mockRejectedValue(error)
        await expect(getColumnDbModel(mockId, page)).rejects.toThrow("Database fetch failed")
        expect(logger.error).toHaveBeenCalledWith(
            "[model]Error during database fetch:",
            error
        );
    })
})