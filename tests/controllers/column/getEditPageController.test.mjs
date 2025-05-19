vi.mock('../../../src/models/column/getViewDbModel.mjs', () => ({
    getViewDbModel: vi.fn()
}));

vi.mock('../../../config/logger.mjs', () => ({
    default: {
        error: vi.fn()
    }
}));

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getEditPageController } from '../../../src/controllers/column/getEditPageController.mjs';
import { getViewDbModel } from '../../../src/models/column/getViewDbModel.mjs';
import logger from '../../../config/logger.mjs';

describe('getEditPageController', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        vi.clearAllMocks();
        mockReq = { params: { id: '1' } };
        mockRes = {
            render: vi.fn(),
            redirect: vi.fn()
        };
    });

    it('正常に編集画面をレンダリングする', async () => {
        const mockData = {
            column: [{
                id: 1,
                userid: 13,
                date: "2025-05-10",
                place: "test",
                who: "test",
                content: "test",
                created_at: "2025-05-15",
                title: "test",
                action: "test",
                realize: "test",
                physical: "test",
            }],
            feeling: [{ id: 25, feeling: 'test', feelingPer: 19, experience_id: 1 }],
            autothink: [{ id: 30, experience_id: 1, autoThink: 'test', autoThinkPer: 1 }]
        };
        getViewDbModel.mockResolvedValue(mockData);
        await getEditPageController(mockReq, mockRes);
        expect(getViewDbModel).toHaveBeenCalledWith('1');
        expect(mockRes.render).toHaveBeenCalledWith('memo.ejs', {
            memo: mockData.column,
            feel: mockData.feeling,
            autothink: mockData.autothink,
            date: '2025-05-10'
        });
    });

    it('columnがない場合、エラーログを出してリダイレクトする', async () => {
        getViewDbModel.mockResolvedValue({ column: null });
        await getEditPageController(mockReq, mockRes);
        expect(logger.error).toHaveBeenCalledWith('編集画面に移動できませんでした');
        expect(mockRes.redirect).toHaveBeenCalledWith('/top?error=true');
    });

    it('例外が発生した場合、エラーログを出してリダイレクトする', async () => {
        getViewDbModel.mockRejectedValue(new Error('DB error'));
        await getEditPageController(mockReq, mockRes);
        expect(logger.error).toHaveBeenCalledWith('[controller]database fetch failed:', expect.any(Error));
        expect(mockRes.redirect).toHaveBeenCalledWith('/top?error=true');
    });
});
