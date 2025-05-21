vi.mock("../../../config/db.mjs", () => ({
  default: {
    getConnection: vi.fn(),
  },
}));
vi.mock("../../../config/logger.mjs", () => ({
  default: {
    error: vi.fn(),
  },
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerDbModel } from "../../../src/models/column/registerDbModel.mjs";
import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";

describe("registerDbModel", () => {
  const mockCon = {
    beginTransaction: vi.fn(),
    execute: vi.fn(),
    query: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
    release: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    connection.getConnection.mockResolvedValue(mockCon);
  });

  it("正常に登録できるとtrueを返す", async () => {
    mockCon.execute.mockResolvedValue([{ insertId: 20 }]);
    mockCon.query.mockResolvedValue(true);
    mockCon.commit.mockResolvedValue();

    const userid = 1;
    const name_title = "test";
    const date = "2025-05-19";
    const place = "公園";
    const withwhom = "一人";
    const content = "本を読んでいたとき";
    const feeling_obj = { "幸せ": "80", "悲しい": "20" };
    const autothink_obj = { "しんどいな": "50%", "楽しいな": "50%" };
    const physical = "緊張";
    const action = "深呼吸をした";
    const realize = "気持ちが落ち着いた";

    const result = await registerDbModel(userid, name_title, date, place, withwhom, content, feeling_obj, autothink_obj, physical, action, realize);

    expect(connection.getConnection).toHaveBeenCalled();
    expect(mockCon.beginTransaction).toHaveBeenCalled();
    expect(mockCon.execute).toHaveBeenCalledWith(
      'insert into experience_column (userid,title,date,place,who,content,physical,action,realize) values (?,?,?,?,?,?,?,?,?)',
      [userid, name_title, date, place, withwhom, content, physical, action, realize]
    );

    expect(mockCon.query).toHaveBeenCalledTimes(2);
    expect(mockCon.commit).toHaveBeenCalled();
    expect(mockCon.release).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("例外が発生したらロールバックしてfalseを返す", async () => {
    mockCon.execute.mockRejectedValue(new Error("DB error"));
    mockCon.rollback.mockResolvedValue();

    const userid = 1;
    const name_title = "test";
    const date = "2025-05-19";
    const place = "公園";
    const withwhom = "一人";
    const content = "本を読んでいたとき";
    const feeling_obj = { "幸せ": "80", "悲しい": "20" };
    const autothink_obj = { "しんどいな": "50%", "楽しいな": "50%" };
    const physical = "緊張";
    const action = "深呼吸をした";
    const realize = "気持ちが落ち着いた";
    const result = await registerDbModel(userid, name_title, date, place, withwhom, content, feeling_obj, autothink_obj, physical, action, realize);

    expect(mockCon.rollback).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "[model]Error during database registration:",
      expect.any(Error)
    );
    expect(mockCon.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
