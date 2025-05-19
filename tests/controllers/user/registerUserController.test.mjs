vi.mock("bcrypt", () => ({
  default:{hash: vi.fn()}
}));
vi.mock("../../../config/mail.mjs", () => ({
  default: {
    sendMail: vi.fn(),
  },
}));
vi.mock("../../../config/logger.mjs", () => ({
  default: {
    error: vi.fn(),
  },
}));
vi.mock("../../../src/models/user/mailCheckDbModel.mjs", () => ({
  mailCheckDbModel: vi.fn(),
}));
vi.mock("../../../src/models/user/UserDbModel.mjs", () => ({
  newUserDbModel: vi.fn(),
}));
vi.mock("jsonwebtoken", () => ({
  default:{sign: vi.fn()}
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { newUserController } from "../../../src/controllers/user/registerUserController.mjs";
import transporter from "../../../config/mail.mjs";
import logger from "../../../config/logger.mjs";
import { mailCheckDbModel } from "../../../src/models/user/mailCheckDbModel.mjs";
import { newUserDbModel } from "../../../src/models/user/UserDbModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("newUserController", () => {
  const mockReq = {
    body: {
      address: "test@example.com",
      userpassword: "Password123",
    },
  };

  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SECRET = "testsecret";
    process.env.MAIL_URL = "http://localhost:3000";
    process.env.MAIL_USER = "test@example.com";
  });

  it("空白がある場合は400を返す", async () => {
    const req = { body: { address: "", userpassword: "" } };
    await newUserController(req, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "空白があります" });
  });

  it("メールアドレスが既に登録されている場合は404を返す", async () => {
    mailCheckDbModel.mockResolvedValue(true);
    await newUserController(mockReq, mockRes);
    expect(mailCheckDbModel).toHaveBeenCalledWith("test@example.com");
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "このメールアドレスは既に登録されています" });
  });

  it("正常に処理が進み、確認メール送信成功時は200を返す", async () => {
    mailCheckDbModel.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue("hashedpassword");
    newUserDbModel.mockResolvedValue([{ insertId: "1" }]);
    jwt.sign.mockReturnValue("signedtoken");
    transporter.sendMail.mockResolvedValue(true)

    await newUserController(mockReq, mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith("Password123", 10);
    expect(newUserDbModel).toHaveBeenCalledWith("test@example.com", "hashedpassword");
    expect(jwt.sign).toHaveBeenCalledWith({ userid: "1" }, "testsecret", { expiresIn: "1h" });
    expect(transporter.sendMail).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "確認メールを送信しました。メールから登録を完了させてください。",
    });
  });

  it("メール送信に失敗した場合は500を返す", async () => {
    mailCheckDbModel.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue("hashedpassword");
    newUserDbModel.mockResolvedValue([{ insertId: "1" }]);
    jwt.sign.mockReturnValue("signedtoken");
    transporter.sendMail.mockResolvedValue(false)
    await newUserController(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "メール送信に失敗しました" });
  });

  it("サーバーエラー時は500を返す", async () => {
    mailCheckDbModel.mockRejectedValue(new Error("DB connection error"));

    await newUserController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith(
      "[controller]Error during fetch mailaddress:",
      expect.any(Error)
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "メール送信に失敗しました" });
  });
});
