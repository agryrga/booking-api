/**
 * Проверка роли пользователя.
 *
 * @param {string[]} allowedRoles - Список разрешённых ролей, например ['ADMIN']
 * @returns {Function} Express middleware
 */
export function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.user?.role

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: 'Доступ запрещён: недостаточно прав' })
    }

    next()
  }
}
