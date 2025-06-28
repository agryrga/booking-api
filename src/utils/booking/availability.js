import { prisma } from '../../prisma.js'

/**
 * Проверяет, свободен ли слот для бронирования.
 * Проверяется пересечение интервала [start, end).
 * При обновлении передаём excludeBookingId, чтобы исключить её из проверки.
 *
 * @param {number} userId
 * @param {Date} start - начало брони
 * @param {Date} end - конец брони
 * @param {number} [excludeBookingId]
 * @returns {Promise<boolean>} true если слот свободен, false если занят
 */
export async function isTimeSlotAvailable(
  userId,
  start,
  end,
  excludeBookingId
) {
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      NOT: excludeBookingId ? { id: excludeBookingId } : undefined,
      AND: [
        {
          start: { lt: end },
        },
        {
          end: { gt: start },
        },
      ],
    },
  })

  return !conflictingBooking
}
