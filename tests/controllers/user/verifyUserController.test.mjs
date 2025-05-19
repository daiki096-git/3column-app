vi.mock("../../../src/models/user/UserDbModel.mjs", () => ({
    activateUserDbModel: vi.fn()
}))
vi.mock("../../../config/logger.mjs", () => ({
    default: {
        error: vi.fn()
    }
}))
vi.mock("../../../src/utils/jwt.mjs", () => ({
  verifyjwtToken: vi.fn(() => Promise.resolve({ userid: "1" }))
}));

import { verifyUserController } from "../../../src/controllers/user/verifyUserController.mjs";
import { activateUserDbModel } from "../../../src/models/user/UserDbModel.mjs";
import { vi, it, describe, expect, beforeEach } from "vitest";
import jwt from "jsonwebtoken"
import logger from "../../../config/logger.mjs";

describe('verifyUserController', () => {
    const jwt_secret = "test";
    const token = jwt.sign({ userid: "1" }, jwt_secret, { expiresIn: "1h" })
    const mockReq = {
        query: { token }
    }
    const mockRes = {
        status: vi.fn(() => mockRes),
        send: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('ユーザー登録成功時、200を返す', async () => {
        activateUserDbModel.mockResolvedValue([{ affectedRows: 1 }]);

        await verifyUserController(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.send).toHaveBeenCalledWith('ユーザー登録に成功しました:ログインページからログインしてください');

    })
    it('ユーザー登録に失敗、404を返す', async () => {
        activateUserDbModel.mockResolvedValue([{ affectedRows: 0 }]);
        await verifyUserController(mockReq, mockRes)
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith('ユーザー登録に失敗しました');
    })
    it('サーバーエラー、500を返す', async () => {
        activateUserDbModel.mockRejectedValue(new Error("DB connection error"));
        await verifyUserController(mockReq, mockRes)
        expect(logger.error).toHaveBeenCalledWith('[controller]Error during user verification:', expect.any(Error));
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith('サーバーエラーが発生しました');
    })
})