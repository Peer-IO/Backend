import {me , updateMe} from './user.controller'
import { Router } from 'express'

const router = Router()

router.get('/', me)
router.put('/', updateMe)

export default router