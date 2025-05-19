vi.mock('../../../src/models/column/deleteDbModel.mjs', () => ({
  deleteDbModel: vi.fn()
}));
vi.mock('../../../config/logger.mjs', () => ({
  default: {
    error: vi.fn(),
  }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteController } from '../../../src/controllers/column/deleteController.mjs';
import { deleteDbModel } from '../../../src/models/column/deleteDbModel.mjs';
import logger from '../../../config/logger.mjs';

describe('deleteController', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      params: {
        id: '1'
      }
    };
    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn()
    };
  });

  it('正常系: 削除成功時、200を返す', async () => {
    deleteDbModel.mockResolvedValue(true);

    await deleteController(mockReq, mockRes);

    expect(deleteDbModel).toHaveBeenCalledWith('1');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '削除に成功しました' });
  });

  it('異常系: 削除失敗時（成功フラグがfalse）、500を返す', async () => {
    deleteDbModel.mockResolvedValue(false);

    await deleteController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith("Database delete failed");
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '削除に失敗しました' });
  });

  it('異常系: 例外発生時、500を返す', async () => {
    deleteDbModel.mockRejectedValue(new Error('DB error'));

    await deleteController(mockReq, mockRes);

    expect(logger.error).toHaveBeenCalledWith(
      "[controller]database connection failed",
      expect.any(Error)
    );
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '削除に失敗しました' });
  });
});
