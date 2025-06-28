import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

/**
 * Middleware аутентификации пользователя по JWT.
 *
 * Извлекает токен из заголовка Authorization.
 * Если токен валиден — добавляет payload в req.user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Неверный формат токена' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)

    if (!payload.userId) {
      return res.status(403).json({ error: 'Недействительный токен' })
    }

    req.user = payload
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Токен недействителен' })
  }
}
