
vi.mock('../../../src/models/column/searchDbModel.mjs', () => ({
  searchDbModel: vi.fn()
}));
vi.mock('../../../src/utils/getSearchDate.mjs', () => ({
  getSearchDate: vi.fn()
}));
vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchController } from '../../../src/controllers/column/searchController.mjs';
import { searchDbModel } from '../../../src/models/column/searchDbModel.mjs';
import { getSearchDate } from '../../../src/utils/getSearchDate.mjs';
import logger from '../../../config/logger.mjs';

describe('searchController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      session: {
        userid: '1',
        userData: { date: '2024-01-01' },
        searchData: {}
      },
      query: {
        search: 'test'
      }
    };
    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn()
    };
  });

  it('検索結果がある場合、検索結果を返す', async () => {
    const session_id="1"
    const mockResults = [[{ id: "1", title: 'test title', date:'2024-05-01' }]];

    searchDbModel.mockResolvedValue(mockResults);
    getSearchDate.mockReturnValue({date:'2024-05-01'});

    await searchController(mockReq, mockRes);

    expect(searchDbModel).toHaveBeenCalledWith(session_id, '%test%');
    expect(getSearchDate).toHaveBeenCalledWith(mockResults[0], session_id);
    expect(mockReq.session.searchData.date).toBe('2024-05-01');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('検索結果がない場合、userData.dateを設定してメッセージ返す', async () => {
    searchDbModel.mockResolvedValue([[]]);

    await searchController(mockReq, mockRes);
    expect(mockReq.session.searchData.date).toBe('2024-01-01');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '検索結果に一致するデータがありませんでした'
    });
  });

  it('例外発生時、500とエラーメッセージを返す', async () => {
    searchDbModel.mockRejectedValue(new Error('DB connection error'));

    await searchController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith('[controller]database connection failed');
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '通信エラー' });
  });
});
