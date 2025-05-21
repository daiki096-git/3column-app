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
import { deleteDbModel } from "../../../src/models/column/deleteDbModel.mjs";
import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";

describe("deleteDbModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常に削除できたらtrueを返す", async () => {
    connection.execute.mockResolvedValue();
    const result = await deleteDbModel(1);
    expect(connection.execute).toHaveBeenCalledWith(
      "delete from experience_column where id=?",
      [1]
    );
    expect(result).toBe(true);
  });

  it("エラーの場合,falseを返し、logger.errorが呼ばれる", async () => {
    const error = new Error("DB error");
    connection.execute.mockRejectedValue(error);
    const result = await deleteDbModel(1);
    expect(connection.execute).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "[model]Error during database delete:",
      error
    );
    expect(result).toBe(false);
  });
});
