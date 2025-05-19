vi.mock("../../../src/models/user/mailCheckDbModel.mjs", () => ({
  mailCheckDbModel: vi.fn()
}));
vi.mock("../../../src/models/user/UserDbModel.mjs", () => ({
  updateTimeDbModel: vi.fn()
}));
vi.mock("../../../config/logger.mjs", () => ({
  default: {
    error: vi.fn()
  }
}));
vi.mock("../../../config/mail.mjs", () => ({
  default: {
    sendMail: vi.fn()
  }
}));

import { vi, describe, it, expect, beforeEach } from "vitest";
import { reconfirmController } from "../../../src/controllers/user/reconfirmController.mjs";
import { mailCheckDbModel } from "../../../src/models/user/mailCheckDbModel.mjs";
import { updateTimeDbModel } from "../../../src/models/user/UserDbModel.mjs";
import logger from "../../../config/logger.mjs";
import transporter from "../../../config/mail.mjs";

describe("reconfirmController", () => {
  const OLD_ENV = process.env;
  const mockReq = {
    body: {
      address: "test@example.com"
    }
  };
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV, SECRET: "testsecret", MAIL_URL: "http://localhost", MAIL_USER: "test@example.com" };
  });

  it("メールアドレスが未登録なら404を返す", async () => {
    mailCheckDbModel.mockResolvedValue(null);
    await reconfirmController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "このメールアドレスは登録されていません" });
  });

  it("既に認証済みなら400を返す", async () => {
    mailCheckDbModel.mockResolvedValue([{ status: "active" }]);
    await reconfirmController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "このアカウントは既に認証済みです" });
  });

  it("確認メールを既に送信済みなら429を返す", async () => {
    const lessThanOneHourAgo = new Date(Date.now() - 30 * 60 * 1000);
    mailCheckDbModel.mockResolvedValue([{ status: "pending", created_at: lessThanOneHourAgo }]);
    await reconfirmController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "確認メールは既に送信されています。メールをご確認ください。" });
  });

  it("メール送信が成功したら200を返す", async () => {
    const overAnHourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const fakeUserid = "1";
    mailCheckDbModel.mockResolvedValue([{ status: "pending", created_at: overAnHourAgo, userid: fakeUserid }]);
    transporter.sendMail.mockResolvedValue(true)
    await reconfirmController(mockReq, mockRes);
    expect(updateTimeDbModel).toHaveBeenCalledWith(fakeUserid, expect.any(Date));
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "確認メールを送信しました。メールから登録を完了させてください。"
    });
  });

  it("メール送信失敗したら、500を返す", async () => {
    mailCheckDbModel.mockRejectedValue(new Error("DB connection Error"));
    await reconfirmController(mockReq, mockRes);
    expect(logger.error).toHaveBeenCalledWith("[controller]Error during fetch mailaddress:", expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "メール送信に失敗しました" });
  });
});
