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
import { checkRoles } from '../middleware/role.js'

const router = express.Router()

router.post('/', authenticateToken, createBooking)
router.get('/', authenticateToken, getUserBookings)
router.delete('/:id', authenticateToken, deleteBookingById)
router.delete('/', authenticateToken, deleteAllUserBookings)
router.put('/:id', authenticateToken, updateBookingById)
router.get(
  '/all',
  authenticateToken,
  checkRoles(['ADMIN']),
  getAllBookingsForAdmin
)

export default router
