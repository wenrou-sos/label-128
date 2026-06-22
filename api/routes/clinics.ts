import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const clinics = store.getClinics()
    res.json({
      success: true,
      data: clinics,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取分院列表失败',
    })
  }
})

export default router
