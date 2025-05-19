vi.mock('../../../config/mail.mjs', () => ({
  default: {
    sendMail: vi.fn()
  }
}));
vi.mock('../../../src/models/user/UserDbModel.mjs', () => ({
  getAddressDbModel: vi.fn(),
  updatePasswordDbModel: vi.fn()
}));
vi.mock('../../../src/utils/jwt.mjs', () => ({
  verifyjwtToken: vi.fn()
}));
vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn()
  }
}));
vi.mock("bcrypt", () => ({
  default: { hash: vi.fn() }
}));
vi.mock("jsonwebtoken", () => ({
  _esModule:true,
  default: { sign:vi.fn(() => "signedtoken" )}
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyMailController, getPasswordPageController, newPasswordController } from '../../../src/controllers/auth/resetPasswordController.mjs';
import { getAddressDbModel, updatePasswordDbModel } from '../../../src/models/user/UserDbModel.mjs';
import { verifyjwtToken } from '../../../src/utils/jwt.mjs';
import bcrypt from 'bcrypt';
import transporter from '../../../config/mail.mjs';
import logger from '../../../config/logger.mjs';
import jwt from "jsonwebtoken"

describe('verifyMailController', () => {
  const OLD_ENV = process.env;
  const mockReq = {
    body: { address: 'test@example.com' }
  };
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV, SECRET: "testsecret", MAIL_URL: "http://localhost", MAIL_USER: "test@example.com" };
  });

  afterAll(() => {
    process.env = OLD_ENV;  // テスト後に元に戻す
  });
  it('メールが存在しない場合、400エラーを返す', async () => {
    getAddressDbModel.mockResolvedValue([[]]);
    await verifyMailController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "入力されたメールアドレスは登録されていません" });
  });

  it('メールが存在する場合、メール送信して200を返す', async () => {
    getAddressDbModel.mockResolvedValue([[{
      userid: 1,
      mailaddress: "test@example.com",
      password: "$2b$10$XnIfaWAnPwz.avMi2/6YfO4gC7YAZULNW0GvX5nYTrv0/B0xzS4r2",
      status: "pending",
      created_at: "2025-05-19T06:56:58.000Z",
    }]]);
    jwt.sign.mockReturnValue("signedtoken");
    transporter.sendMail.mockResolvedValue(true)
    await verifyMailController(mockReq, mockRes);
    expect(transporter.sendMail).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "アカウント再登録フォームをメールアドレスに送信しました" });
  });

  it('メール送信に失敗したら、500を返す', async () => {
    getAddressDbModel.mockRejectedValue(new Error('DB error'));
    await verifyMailController(mockReq, mockRes);
    expect(logger.error).toHaveBeenCalledWith("Error during fetch mailaddress:", expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "メール送信に失敗しました" });
  });
});

describe('getPasswordPageController', () => {
  it('トークンからメールアドレスを取得してビューを返す', async () => {
    const mockReq = {
      query: { token: 'dummy_token' }
    };
    const mockRes = {
      render: vi.fn()
    };
    verifyjwtToken.mockResolvedValue({ mailaddress: 'test@example.com' });

    await getPasswordPageController(mockReq, mockRes);
    expect(mockRes.render).toHaveBeenCalledWith('modify_newuser.ejs', { mailaddress: 'test@example.com' });
  });
});

describe('newPasswordController', () => {
  const mockReq = {
    body: {
      password: 'Password123',
      address: 'test@example.com'
    }
  };
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('パスワード更新成功時、200を返す', async () => {
    bcrypt.hash.mockResolvedValue('hashedpassword');
    updatePasswordDbModel.mockResolvedValue([{ affectedRows: 1 }]);

    await newPasswordController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "アカウント登録に成功しました" });
  });

  it('メールアドレスが存在しない場合、400を返す', async () => {
    bcrypt.hash.mockResolvedValue('hashedpassword');
    updatePasswordDbModel.mockResolvedValue([{ affectedRows: 0 }]);

    await newPasswordController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "入力されたメールアドレスは存在しません" });
  });

  it('更新中にエラーが発生した場合、500を返す', async () => {
    bcrypt.hash.mockResolvedValue('hashedpassword');
    updatePasswordDbModel.mockRejectedValue(new Error('Update failed'));

    await newPasswordController(mockReq, mockRes);
    expect(logger.error).toHaveBeenCalledWith("[controller]Error during database update:", expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "アカウント更新に失敗しました" });
  });
});
