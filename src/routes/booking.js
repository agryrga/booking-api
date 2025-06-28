import express from 'express'
import { prisma } from '../prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { isTimeSlotAvailable } from '../utils/booking.js'

const router = express.Router()

// Создание брони
router.post('/', authenticateToken, async (req, res) => {
  const { start, description } = req.body

  if (!start) {
    return res.status(400).json({ error: 'Дата и время обязательны' })
  }

  try {
    const bookingStart = new Date(start)

    const available = await isTimeSlotAvailable(req.user.userId, bookingStart)

    if (!available) {
      return res.status(400).json({ error: 'В это время уже есть бронь' })
    }

    const booking = await prisma.booking.create({
      data: {
        start: bookingStart,
        description,
        userId: req.user.userId,
      },
    })

    res.status(201).json(booking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при создании бронирования' })
  }
})

// Получить все бронирования пользователя (с фильтром по дате)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query
    let where = { userId: req.user.userId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      where.start = {
        gte: startDate,
        lt: endDate,
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { start: 'asc' },
    })

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при получении бронирований' })
  }
})

// Удаление бронирования по ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const bookingId = Number(req.params.id)

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking || booking.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Бронь не найдена' })
    }

    await prisma.booking.delete({ where: { id: bookingId } })
    res.json({ message: 'Бронь удалена' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при удалении брони' })
  }
})

// Удаление всех броней пользователя
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await prisma.booking.deleteMany({ where: { userId: req.user.userId } })
    res.json({ message: 'Все брони удалены' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при удалении всех броней' })
  }
})

// Обновление брони
router.put('/:id', authenticateToken, async (req, res) => {
  const bookingId = Number(req.params.id)
  const { start, description } = req.body

  if (!start) {
    return res.status(400).json({ error: 'Дата и время обязательны' })
  }

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!existingBooking || existingBooking.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Бронь не найдена' })
    }

    const bookingStart = new Date(start)

    const available = await isTimeSlotAvailable(
      req.user.userId,
      bookingStart,
      bookingId
    )

    if (!available) {
      return res.status(400).json({ error: 'В это время уже есть бронь' })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        start: bookingStart,
        description,
      },
    })

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при обновлении брони' })
  }
})

export default router
