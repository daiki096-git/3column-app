vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn()
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getYearDateController } from '../../../src/controllers/column/getYearDateController.mjs';
import logger from '../../../config/logger.mjs';

describe('getYearDateController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      session: {
        userid: '2',
        userData: {
          date: {
            '2025/5/01': Array(1),
            '2025/5/15': Array(1),
            '2024/6/01': Array(1),
            '2023/5/01': Array(1)
          }
        }
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

    await getYearDateController(mockReq, mockRes);

    expect(mockReq.session.searchData).toEqual({
      date: {
        '2025/5/01': Array(1),
        '2025/5/15': Array(1)
      },
      userid: '2'
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('月がnoneの場合、指定の年に一致するすべてのデータを返す', async () => {
    mockReq.query = { year: '2024', month: 'none' };

    await getYearDateController(mockReq, mockRes);

    expect(mockReq.session.searchData).toEqual({
      date: {
        '2024/6/01': Array(1)
      },
      userid: '2'
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('一致するデータがない場合、メッセージとともに返す', async () => {
    mockReq.query = { year: '2022', month: '05' };

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
