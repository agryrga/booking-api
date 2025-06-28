import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'
import { JWT_SECRET } from '../config.js'

export async function register(req, res) {
  const { name, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({ message: 'Пользователь создан', userId: user.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Неверный email или пароль' })
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}
