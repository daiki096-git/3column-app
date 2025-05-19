
vi.mock('../../../src/models/column/registerDbModel.mjs', () => ({
  registerDbModel: vi.fn()
}));

vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerController } from '../../../src/controllers/column/registerController.mjs';
import { registerDbModel } from '../../../src/models/column/registerDbModel.mjs';
import logger from '../../../config/logger.mjs';

describe('registerController', () => {
  const mockReq = {
    session: { userid: 1 },
    body: {
      date: '2024-05-19',
      action: '深呼吸をした',
      notion: '気持ちが落ち着いた',
      feeling_obj: { "幸せ": "20%","悲しみ":"30%" },
      autothink_obj: { "しんどいな": "20%","だるいな":"30%" },
      title: '今日のお昼',
      content: 'ご飯を食べようとしたとき',
      where: '公園',
      who: '一人',
      physical: '緊張'
    }
  };

  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('登録成功時、200を返す', async () => {
    registerDbModel.mockResolvedValue(true);

    await registerController(mockReq, mockRes);

    expect(registerDbModel).toHaveBeenCalledWith(
      1,
      '今日のお昼',
      '2024-05-19',
      '公園',
      '一人',
      'ご飯を食べようとしたとき',
      { "幸せ": "20%","悲しみ":"30%" },
      { "しんどいな": "20%","だるいな":"30%" },
      '緊張',
      '深呼吸をした',
      '気持ちが落ち着いた'
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '登録に成功しました' });
  });

  it('登録失敗時、500を返す', async () => {
    registerDbModel.mockResolvedValue(false);

    await registerController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('Database registeration failed.');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '登録に失敗しました' });
  });

  it('例外発生時、500を返す', async () => {
    registerDbModel.mockRejectedValue(new Error('DB connection  error'));

    await registerController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('[controller]database connection failed:', expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '登録に失敗しました' });
  });
});
