vi.mock('bcrypt')
vi.mock('../../../config/logger.mjs',()=>({
default:{
  error:vi.fn(),
  info:vi.fn()
}
}))
vi.mock('../../../src/models/user/UserDbModel.mjs',()=>({
  getAddressDbModel:vi.fn()
}))
vi.mock('../../../src/services/getSortDate.mjs',()=>({
  getSortDate:vi.fn()
}))

import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcrypt'
import logger from '../../../config/logger.mjs'
import { getAddressDbModel } from '../../../src/models/user/UserDbModel.mjs'
import { getSortDate } from '../../../src/services/getSortDate.mjs'
import { loginVerifyController } from '../../../src/controllers/auth/loginController.mjs'



describe('loginVerifyController', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      session: {},
    }
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    }
    vi.clearAllMocks()
  })

  it('正常系: ログイン成功', async () => {
    req.body.mail = 'test@example.com'
    req.body.password = 'Password123'

    getAddressDbModel.mockResolvedValue([
      [
        {
          userid: 1,
          password: 'hashed_password',
          status: 'active',
        },
      ],
    ])
    bcrypt.compare.mockResolvedValue(true)
    getSortDate.mockResolvedValue({
      date: {'2025-05-17':Array(1),'2025-05-14':Array(1)},
      userid: 1,
      total: 2,
    })

    await loginVerifyController(req, res)

    expect(getAddressDbModel).toHaveBeenCalledWith('test@example.com')
    expect(bcrypt.compare).toHaveBeenCalledWith('Password123', 'hashed_password')
    expect(getSortDate).toHaveBeenCalledWith(1, 1)

    expect(req.session.userid).toBe(1)
    expect(req.session.userData).toEqual({
      date: {'2025-05-17':Array(1),'2025-05-14':Array(1)},
      current: 1,
      userid: 1,
      total: 2,
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'ログイン成功' })
  })

  it('異常系: ユーザーが見つからない', async () => {
    req.body.mail = 'test@example.com'
    getAddressDbModel.mockResolvedValue([[]])

    await loginVerifyController(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'ユーザーが見つかりません' })
  })

  it('異常系: ユーザー認証が完了していない', async () => {
    req.body.mail = 'test@example.com'
    getAddressDbModel.mockResolvedValue([
      [
        {
          userid: 1,
          password: 'hashed_password',
          status: 'pending',
        },
      ],
    ])

    await loginVerifyController(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'ユーザー認証が完了していません。メールから認証を完了させてください。' })
  })

  it('異常系: パスワード認証失敗', async () => {
    req.body.mail = 'test@example.com'
    req.body.password = 'Password123'
    getAddressDbModel.mockResolvedValue([
      [
        {
          userid: 1,
          password: 'hashed_password',
          status: 'active',
        },
      ],
    ])
    bcrypt.compare.mockResolvedValue(false)

    await loginVerifyController(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: '認証に失敗しました' })
  })

  it('異常系: 例外発生時', async () => {
    req.body.mail = 'test@example.com'
    req.body.password = 'Password123'
    const error = new Error('DB connection error')
    getAddressDbModel.mockRejectedValue(error)

    await loginVerifyController(req, res)

    expect(logger.error).toHaveBeenCalledWith("[controller]認証に失敗しました:",expect.any(Error))
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'ログインに失敗しました',
      error: 'DB connection error',
    })
  })
})
