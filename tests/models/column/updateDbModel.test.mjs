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
import { updateDbModel } from "../../../src/models/column/updateDbModel.mjs";
import connection from "../../../config/db.mjs";
import logger from "../../../config/logger.mjs";

const mockCon = {
  beginTransaction: vi.fn(),
  execute: vi.fn(),
  query: vi.fn(),
  commit: vi.fn(),
  rollback: vi.fn(),
  release: vi.fn(),
};


describe("updateDbModel", () => {
  const mockParams = [
    "2025-05-19",       
    "test",      
    "公園",             
    "一人で",            
    "本を読んでいた時",          
    { "幸せ": "80", "悲しい": "20" },  
    { "しんどいな": "50%", "楽しいな": "50%" },     
    "緊張",      
    "深呼吸をした",           
    "落ち着いた",           
    1                
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    connection.getConnection.mockResolvedValue(mockCon);
  });

  it("成功時はtrueを返す", async () => {
    
    mockCon.execute.mockResolvedValue();
    mockCon.query.mockResolvedValue();

    const result = await updateDbModel(...mockParams);
    
    expect(mockCon.beginTransaction).toHaveBeenCalled();
    expect(mockCon.execute).toHaveBeenCalledTimes(3);
    expect(mockCon.query).toHaveBeenCalledTimes(2);
    expect(mockCon.commit).toHaveBeenCalled();
    expect(mockCon.release).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("失敗時はfalseを返し、rollbackとlogger.errorが呼ばれる", async () => {
    mockCon.execute.mockRejectedValue(new Error("DB error"));

    const result = await updateDbModel(...mockParams);

    expect(mockCon.rollback).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(
      "[model]Error during database update:",
      expect.any(Error)
    );
    expect(mockCon.release).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
