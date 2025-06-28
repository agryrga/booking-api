/**
 * Проверяет, что start и end переданы и корректны.
 * @param {string|Date} start
 * @param {string|Date} end
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateBookingDates(start, end) {
  if (!start || !end) {
    return {
      valid: false,
      message: 'Дата и время начала и окончания обязательны',
    }
  }

  const bookingStart = new Date(start)
  const bookingEnd = new Date(end)

  if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
    return { valid: false, message: 'Некорректный формат даты' }
  }

  if (bookingEnd <= bookingStart) {
    return {
      valid: false,
      message: 'Время окончания должно быть позже времени начала',
    }
  }

  return { valid: true }
}
