import { prisma } from '../prisma.js'
import {
  isTimeSlotAvailable,
  validateBookingDates,
} from '../utils/booking/index.js'

export const createBooking = async (req, res) => {
  const { start, end, description } = req.body

  const validation = validateBookingDates(start, end)
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message })
  }

  const bookingStart = new Date(start)
  const bookingEnd = new Date(end)

  try {
    const available = await isTimeSlotAvailable(
      req.user.userId,
      bookingStart,
      bookingEnd
    )

    if (!available) {
      return res.status(400).json({ error: 'В это время уже есть бронь' })
    }

    const booking = await prisma.booking.create({
      data: {
        start: bookingStart,
        end: bookingEnd,
        description,
        userId: req.user.userId,
      },
    })

    res.status(201).json(booking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при создании бронирования' })
  }
}

export const getUserBookings = async (req, res) => {
  try {
    const { date } = req.query
    let where = { userId: req.user.userId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      where.AND = [{ start: { gte: startDate } }, { start: { lt: endDate } }]
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
}

export const deleteBookingById = async (req, res) => {
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
}

export const deleteAllUserBookings = async (req, res) => {
  try {
    await prisma.booking.deleteMany({ where: { userId: req.user.userId } })
    res.json({ message: 'Все брони удалены' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при удалении всех броней' })
  }
}

export const updateBookingById = async (req, res) => {
  const bookingId = Number(req.params.id)
  const { start, end, description } = req.body

  const validation = validateBookingDates(start, end)
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message })
  }

  const bookingStart = new Date(start)
  const bookingEnd = new Date(end)

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!existingBooking || existingBooking.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Бронь не найдена' })
    }

    const available = await isTimeSlotAvailable(
      req.user.userId,
      bookingStart,
      bookingEnd,
      bookingId
    )

    if (!available) {
      return res.status(400).json({ error: 'В это время уже есть бронь' })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        start: bookingStart,
        end: bookingEnd,
        description,
      },
    })

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка сервера при обновлении брони' })
  }
}

export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { start: 'asc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    })

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Ошибка сервера при получении всех бронирований' })
  }
}
