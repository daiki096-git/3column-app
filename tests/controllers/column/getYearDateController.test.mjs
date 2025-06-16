vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));
vi.mock('../../../src/services/getSortDate.mjs', () => ({
  getAllSortDate: vi.fn()
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getYearDateController } from '../../../src/controllers/column/getYearDateController.mjs';
import logger from '../../../config/logger.mjs';
import { getAllSortDate } from '../../../src/services/getSortDate.mjs';

describe('getYearDateController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      session: {
        userid: '2',
        userData: {
          date: {
            '2025/5/01': [ { item: 'data' } ],
            '2025/5/15': [ { item: 'data' } ],
            '2024/6/01': [ { item: 'data' } ],
            '2023/5/01': [ { item: 'data' } ]
          }
        },
        searchData: {}, 
      },
      query: {}
    };
    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn()
    };
  });

  it('指定の年月に一致するデータのみ返す', async () => {
    mockReq.query = { year: '2025', month: '05' };
    getAllSortDate.mockResolvedValue({
      date: {
        '2025/5/01': [{ item:'data'}],
        '2025/5/15': [{ item:'data' }],
        '2025/4/01': [{ item: 'data'}],
        '2024/6/01': [{ item: 'data'}]
      }
    });
    await getYearDateController(mockReq, mockRes);

    expect(mockReq.session.searchData).toEqual({
      date: {
        '2025/5/01': [ { item: 'data' } ],
        '2025/5/15': [ { item: 'data' } ],
      },
      userid: '2'
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('月がnoneの場合、指定の年に一致するすべてのデータを返す', async () => {
    mockReq.query = { year: '2024', month: 'none' };
    getAllSortDate.mockResolvedValue({
      date: {
        '2025/5/01': [{ item:'data'}],
        '2025/5/15': [{ item:'data' }],
        '2025/4/01': [{ item: 'data'}],
        '2024/6/01': [{ item: 'data'}]
      }
    });

    await getYearDateController(mockReq, mockRes);

    expect(mockReq.session.searchData).toEqual({
      date: {
        '2024/6/01': [ { item: 'data' } ]
      },
      userid: '2'
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('一致するデータがない場合、メッセージとともに返す', async () => {
    mockReq.query = { year: '2022', month: '05' };
    getAllSortDate.mockResolvedValue({
      date: {
        '2025/5/01': [{ item:'data'}],
        '2025/5/15': [{ item:'data' }],
        '2025/4/01': [{ item: 'data'}],
        '2024/6/01': [{ item: 'data'}]
      }
    });

    await getYearDateController(mockReq, mockRes);

    expect(mockReq.session.searchData).toEqual({
      date: mockReq.session.userData.date,
      userid: '2'
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "検索結果に一致するデータがありませんでした" });
  });

  it('例外が発生した場合、ログを出力し500を返す', async () => {
    mockReq.session.userData = null;

    await getYearDateController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith("[controller]database connection failed", expect.any(Error));
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "通信エラー" });
  });
});
