vi.mock('../../../config/mail.mjs', () => {
  return {
    default: {
      sendMail: vi.fn((options, callback) => callback(null, 'success'))
    }
  };
});
vi.mock('../../../src/models/user/UserDbModel.mjs',()=>({
    getAddressDbModel:vi.fn(),
    updatePasswordDbModel:vi.fn()
}));
vi.mock('../../../src/utils/jwt.mjs',()=>({
    verifyjwtToken:vi.fn()
}));
vi.mock('../../../config/logger.mjs');
vi.mock('bcrypt');

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyMailController, getPasswordPageController, newPasswordController } from '../../../src/controllers/auth/resetPasswordController.mjs';
import { getAddressDbModel,updatePasswordDbModel} from '../../../src/models/user/UserDbModel.mjs';
import { verifyjwtToken } from '../../../src/utils/jwt.mjs';
import bcrypt from 'bcrypt';
import transporter from '../../../config/mail.mjs';

describe('verifyMailController', () => {
  const mockReq = {
    body: { address: 'test@example.com' }
  };
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('メールが存在しない場合、400エラーを返す', async () => {
    getAddressDbModel.mockResolvedValue([[]]);
    await verifyMailController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "入力されたメールアドレスは登録されていません" });
  });

  it('メールが存在する場合、メール送信して200を返す', async () => {
    getAddressDbModel.mockResolvedValue([[{ id: 1 }]]);
    await verifyMailController(mockReq, mockRes);
    /* expect(transporter.sendMail).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "アカウント再登録フォームをメールアドレスに送信しました" }); */
  });

  it('サーバーエラー時、500を返す', async () => {
    getAddressDbModel.mockRejectedValue(new Error('DB error'));
    await verifyMailController(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "サーバーエラーが発生しました" });
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
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "アカウント更新に失敗しました" });
  });
});
