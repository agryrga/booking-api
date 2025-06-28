import express from 'express'
import {
  createBooking,
  getUserBookings,
  deleteBookingById,
  deleteAllUserBookings,
  updateBookingById,
  getAllBookingsForAdmin,
} from '../controllers/bookingController.js'
import { authenticateToken } from '../middleware/auth.js'
import { authorizeRoles } from '../middleware/role.js'

const router = express.Router()

router.post('/', authenticateToken, createBooking)
router.get('/', authenticateToken, getUserBookings)
router.delete('/:id', authenticateToken, deleteBookingById)
router.delete('/', authenticateToken, deleteAllUserBookings)
router.put('/:id', authenticateToken, updateBookingById)
router.get(
  '/all',
  authenticateToken,
  authorizeRoles(['ADMIN']),
  getAllBookingsForAdmin
)

export default router
