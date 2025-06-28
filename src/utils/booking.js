import { prisma } from '../prisma.js'

/**
 * Проверяет, свободен ли слот для бронирования.
 * Бронь длится 1 час.
 * При обновлении передаём excludeBookingId, чтобы исключить её из проверки.
 *
 * @param {number} userId
 * @param {Date} start - начало брони
 * @param {number} [excludeBookingId]
 * @returns {Promise<boolean>} true если слот свободен, false если занят
 */
export async function isTimeSlotAvailable(userId, start, excludeBookingId) {
  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      NOT: excludeBookingId ? { id: excludeBookingId } : undefined,
      start: {
        lt: end,
        gte: start,
      },
    },
  })

  return !conflictingBooking
}
