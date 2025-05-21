vi.mock("../../../config/db.mjs", () => ({
  default: {
    execute: vi.fn(),
  },
}));

vi.mock("../../../config/logger.mjs", () => ({
  default: {
    error: vi.fn(),
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getViewDbModel } from "../../../src/models/column/getViewDbModel.mjs";
import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";

describe("getViewDbModel", () => {
  const mockId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("処理が成功した場合、3つのクエリの結果をまとめて返す", async () => {
    const mockColumn = [[{}],[]];
    const mockFeeling = [[{ id: 1, experience_id: mockId, feeling: "幸せ",feelingPer:"50%" },[]]];
    const mockAutothink = [[{ id: 1, experience_id: mockId, autoThink: "嬉しいな",autoThinkPer:"50%" },[]]];

    connection.execute
      .mockResolvedValueOnce([mockColumn])
      .mockResolvedValueOnce([mockFeeling])
      .mockResolvedValueOnce([mockAutothink]);

    const result = await getViewDbModel(mockId);

    expect(connection.execute).toHaveBeenCalledTimes(3);
    expect(connection.execute).toHaveBeenNthCalledWith(
      1,
      "select * from experience_column where id=?",
      [mockId]
    );
    expect(connection.execute).toHaveBeenNthCalledWith(
      2,
      "select * from feelings where experience_id=?",
      [mockId]
    );
    expect(connection.execute).toHaveBeenNthCalledWith(
      3,
      "select * from autothinks where experience_id=?",
      [mockId]
    );
    expect(result).toEqual({
      column: mockColumn,
      feeling: mockFeeling,
      autothink: mockAutothink,
    });
  });

  it("処理が失敗した場合、ログを出力しエラーをスローする", async () => {
    const error = new Error("DB connection error");
    connection.execute.mockRejectedValue(error);
    await expect(getViewDbModel(mockId)).rejects.toThrow(
      "Database fetch failed"
    );
    expect(logger.error).toHaveBeenCalledWith(
      "[model]Error during database getPage:",
      error
    );
  });
});
