import { Router } from 'express'

import { router as tourRoutes } from '../tours/tourRoutes.js'
import { router as userRoutes } from '../users/userRoutes.js'

const router = Router()

router.use('/tours', tourRoutes)
router.use('/users', userRoutes)

export default router
