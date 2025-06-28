import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('Authorization header:', req.headers['authorization'])

  if (!token) return res.status(401).json({ error: 'Токен отсутствует' })

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Токен недействителен' })
    req.user = payload
    next()
  })
}
