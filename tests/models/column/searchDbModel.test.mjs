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

import {vi,describe,beforeEach,it,expect} from "vitest"
import logger from "../../../config/logger.mjs"
import connection from "../../../config/db.mjs"
import { searchDbModel } from "../../../src/models/column/searchDbModel.mjs";

describe('searchDbModel',()=>{
  const mockResponse=[[{}],[]]
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("処理が成功したとき",async()=>{
  connection.execute.mockResolvedValue(mockResponse)
  const result=await searchDbModel(20,"%test%")
  expect(connection.execute).toHaveBeenCalledWith('select * from experience_column where userid=? and title LIKE ?', [20,"%test%"])
  expect(result).toEqual(mockResponse)
  })
  it("処理が失敗したとき",async()=>{
    const error = new Error("DB connection error");
    connection.execute.mockRejectedValue(error);
    const result=await searchDbModel(20,"%test%")
    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalledWith(
      "[model]Error during database search:",
      error
    );

  })

})