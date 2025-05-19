vi.mock('../../../src/models/column/updateDbModel.mjs', () => ({
  updateDbModel: vi.fn()
}));
vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateController } from '../../../src/controllers/column/updateController.mjs';
import { updateDbModel } from '../../../src/models/column/updateDbModel.mjs';
import logger from '../../../config/logger.mjs';

describe('updateController', () => {
  const mockReq = {
    params: { id: '1' },
    body: {
      date: '2024-05-19',
      title: '今日のお昼ご飯',
      where: '公園',
      who: '友達と',
      content: 'ご飯を食べようとしたとき',
      feeling_obj: { "幸せ": "20%","悲しみ":"30%","焦り":"20%","苦しさ":"80%","後悔":"60%" },
      autothink_obj: { "しんどいな": "20%","だるいな":"30%","辛いな":"30%","めんどくさいな":"50%","なんでこうなるの":"60%" },
      physical: '緊張',
      action: '深呼吸をした',
      notion: '気持ちが落ち着いた'
    }
  };

  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn(),
    send: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('更新成功時、200を返す', async () => {
    updateDbModel.mockResolvedValue(true);

    await updateController(mockReq, mockRes);

    expect(updateDbModel).toHaveBeenCalledWith(
      '2024-05-19',
      '今日のお昼ご飯',
      '公園',
      '友達と',
      'ご飯を食べようとしたとき',
      { "幸せ": "20%","悲しみ":"30%","焦り":"20%","苦しさ":"80%","後悔":"60%" },
      { "しんどいな": "20%","だるいな":"30%","辛いな":"30%","めんどくさいな":"50%","なんでこうなるの":"60%" },
      '緊張',
      '深呼吸をした',
      '気持ちが落ち着いた',
      '1'
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ message: '更新ができました' });
  });

  it('更新失敗時、500を返す', async () => {
    updateDbModel.mockResolvedValue(false);

    await updateController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('Database update failed.');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '更新に失敗しました' });
  });

  it('例外発生時、500を返す', async () => {
    updateDbModel.mockRejectedValue(new Error('DB error'));

    await updateController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('[controller]database connection failed:', expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '更新に失敗しました' });
  });
});
