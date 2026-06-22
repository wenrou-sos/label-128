import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerPhone = req.query.ownerPhone as string | undefined
    if (!ownerPhone) {
      res.status(400).json({
        success: false,
        error: '请提供主人手机号',
      })
      return
    }
    const pets = store.getPets({ ownerPhone })
    res.json({
      success: true,
      data: pets,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取宠物列表失败',
    })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      ownerPhone,
      ownerName,
      name,
      species,
      breed,
      age,
      gender,
      weight,
      isNeutered,
      vaccineStatus,
      avatar,
    } = req.body

    if (!ownerPhone || !name) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数：手机号和宠物名',
      })
      return
    }

    let owner = store.getPetOwnerByPhone(ownerPhone)
    if (!owner) {
      owner = store.createPetOwner({
        name: ownerName ?? '未知',
        phone: ownerPhone,
      })
    }

    const pet = store.createPet({
      ownerId: owner.id,
      ownerPhone,
      name,
      species: species ?? '犬',
      breed: breed ?? '',
      age: age ?? 0,
      gender: gender ?? 'male',
      weight: weight ?? 0,
      isNeutered: isNeutered ?? false,
      vaccineStatus: vaccineStatus ?? '未知',
      avatar: avatar ?? '',
    })

    res.json({
      success: true,
      data: pet,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建宠物档案失败',
    })
  }
})

export default router
