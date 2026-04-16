/**
 * JWT 签名和验证
 * 
 * 使用 jose 库（Next.js 推荐）支持现代 Web Crypto API，更好的 TypeScript 类型支持，更小的包体积，更安全的实现，支持 ES 模块
 */

import * as jose from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
)

export interface JWTPayload {
  userId: string
}

/**
 * 签发 JWT Token
 */
export async function signJWT(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: 'HS256' })//使用 HS256 算法，这是 JWT 中最常用、最安全的对称加密算法之一
    .setExpirationTime('7d')//明确设置 7 天过期时间，平衡安全性和用户体验
    .sign(secret)
}

/**
 * 验证 JWT Token
 */
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jose.jwtVerify(token, secret)
    return { userId: payload.userId as string }
  } catch {
    throw new Error('Invalid token')
  }
}

