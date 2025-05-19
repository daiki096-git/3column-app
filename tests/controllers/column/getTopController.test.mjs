vi.mock('../../../src/services/getSortDate.mjs', () => ({
  getSortDate: vi.fn()
}));

vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTopController } from '../../../src/controllers/column/getTopController.mjs';
import { getSortDate } from '../../../src/services/getSortDate.mjs';
import logger from '../../../config/logger.mjs';

describe('getTopController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      query: {},
      session: {
        userid: '2',
        userData: {}
      }
    };
    mockRes = {
      render: vi.fn(),
      status: vi.fn(() => mockRes),
      json: vi.fn()
    };
  });

  it('3コラ更新の場合、getSortDateを呼びセッションを更新し、レンダリングされる', async () => {
    const mockData = { date: '2024-05-10', total: "16" };
    getSortDate.mockResolvedValue(mockData);
    mockReq.query.page = '1';

    await getTopController(mockReq, mockRes);

    expect(getSortDate).toHaveBeenCalledWith('2', '1');
    expect(mockReq.session.userData).toEqual({
      date: '2024-05-10',
      current: '1',
      total: "16"
    });
    expect(mockRes.render).toHaveBeenCalledWith('top.ejs', {
      date: '2024-05-10',
      userid: "2",
      filter: false,
      error: undefined,
      current: '1',
      total: '16'
    });
  });

  it('更新せずログイン認証後のtopページへの遷移場合、getSortDateを呼ばずにセッションデータを使ってレンダリングされる', async () => {
    mockReq.query.flag = 'true';
    mockReq.session.userData = {
      date: '2024-05-01',
      userid: '2',
      current: '1',
      total: '15'
    };

    await getTopController(mockReq, mockRes);

    expect(getSortDate).not.toHaveBeenCalled();
    expect(mockRes.render).toHaveBeenCalledWith('top.ejs', {
      date: '2024-05-01',
      userid: '2',
      filter: false,
      error: undefined,
      current: '1',
      total: '15'
    });
  });

  it('例外が発生した場合、エラーログを出し、500ステータスを返す', async () => {
    getSortDate.mockRejectedValue(new Error('DB error'));

    await getTopController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('[controller]database get failed:', expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'DB error' });
  });
});
