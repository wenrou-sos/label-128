import type {
  Clinic,
  Department,
  Doctor,
  TimeSlot,
  PetOwner,
  Pet,
  Appointment,
  Registration,
} from './types';

export type {
  Clinic,
  Department,
  Doctor,
  TimeSlot,
  PetOwner,
  Pet,
  Appointment,
  Registration,
};

export const clinics: Clinic[] = [
  {
    id: 1,
    name: '总院',
    address: '北京市朝阳区建国路88号',
    phone: '010-88888888',
    district: '朝阳区',
    openTime: '09:00',
    closeTime: '21:00',
    status: 'active',
  },
  {
    id: 2,
    name: '朝阳分院',
    address: '北京市朝阳区望京SOHO T1',
    phone: '010-66666666',
    district: '朝阳区',
    openTime: '09:00',
    closeTime: '21:00',
    status: 'active',
  },
  {
    id: 3,
    name: '海淀分院',
    address: '北京市海淀区中关村大街1号',
    phone: '010-55555555',
    district: '海淀区',
    openTime: '09:00',
    closeTime: '21:00',
    status: 'active',
  },
];

export const departments: Department[] = [
  {
    id: 1,
    name: '内科',
    code: 'INTERNAL',
    description: '负责宠物内科疾病的诊断与治疗，包括消化系统、呼吸系统、心血管系统等',
    icon: 'Stethoscope',
  },
  {
    id: 2,
    name: '外科',
    code: 'SURGERY',
    description: '负责宠物外科手术，包括软组织手术、肿瘤切除等',
    icon: 'Scissors',
  },
  {
    id: 3,
    name: '骨科',
    code: 'ORTHOPEDICS',
    description: '负责宠物骨骼、关节、韧带等运动系统疾病的诊断与治疗',
    icon: 'Bone',
  },
  {
    id: 4,
    name: '眼科',
    code: 'OPHTHALMOLOGY',
    description: '负责宠物眼部疾病的诊断与治疗，包括白内障、青光眼等',
    icon: 'Eye',
  },
  {
    id: 5,
    name: '皮肤科',
    code: 'DERMATOLOGY',
    description: '负责宠物皮肤疾病的诊断与治疗，包括过敏、真菌感染等',
    icon: 'Sparkles',
  },
  {
    id: 6,
    name: '牙科',
    code: 'DENTISTRY',
    description: '负责宠人口腔健康，包括洗牙、拔牙、牙周病治疗等',
    icon: 'Tooth',
  },
  {
    id: 7,
    name: '猫科',
    code: 'FELINE',
    description: '专注于猫咪专属疾病的诊断与治疗，提供猫友好型诊疗环境',
    icon: 'Cat',
  },
  {
    id: 8,
    name: '异宠科',
    code: 'EXOTIC',
    description: '负责兔子、仓鼠、鸟类、爬行类等异宠的诊疗服务',
    icon: 'Bird',
  },
];

const avatarBase = 'https://api.dicebear.com/7.x/avataaars/svg?seed';

export const doctors: Doctor[] = [
  { id: 1, name: '张医生', title: '主任医师', avatar: `${avatarBase}=zhangwei`, specialties: ['消化系统疾病', '肝病', '胰腺炎'], departmentId: 1, clinicId: 1, roomNumber: '101', status: 'active' },
  { id: 2, name: '李医生', title: '副主任医师', avatar: `${avatarBase}=lihong`, specialties: ['呼吸系统疾病', '心脏病'], departmentId: 1, clinicId: 1, roomNumber: '102', status: 'active' },
  { id: 3, name: '王医生', title: '主治医师', avatar: `${avatarBase}=wangfang`, specialties: ['内分泌疾病', '泌尿系统'], departmentId: 1, clinicId: 2, roomNumber: '201', status: 'active' },
  { id: 4, name: '赵医生', title: '主任医师', avatar: `${avatarBase}=zhaoqiang`, specialties: ['软组织手术', '肿瘤切除'], departmentId: 2, clinicId: 1, roomNumber: '301', status: 'active' },
  { id: 5, name: '钱医生', title: '副主任医师', avatar: `${avatarBase}=qianli`, specialties: ['急诊外科', '创伤修复'], departmentId: 2, clinicId: 3, roomNumber: '302', status: 'active' },
  { id: 6, name: '孙医生', title: '主治医师', avatar: `${avatarBase}=sunyan`, specialties: ['绝育手术', '腹腔手术'], departmentId: 2, clinicId: 2, roomNumber: '303', status: 'active' },
  { id: 7, name: '周医生', title: '主任医师', avatar: `${avatarBase}=zhoujie`, specialties: ['骨折修复', '关节疾病'], departmentId: 3, clinicId: 1, roomNumber: '401', status: 'active' },
  { id: 8, name: '吴医生', title: '副主任医师', avatar: `${avatarBase}=wumei`, specialties: ['脊椎疾病', '运动损伤'], departmentId: 3, clinicId: 2, roomNumber: '402', status: 'active' },
  { id: 9, name: '郑医生', title: '主治医师', avatar: `${avatarBase}=zhenghao`, specialties: ['髋关节发育不良', '韧带修复'], departmentId: 3, clinicId: 3, roomNumber: '403', status: 'active' },
  { id: 10, name: '冯医生', title: '副主任医师', avatar: `${avatarBase}=fengqin`, specialties: ['白内障', '青光眼'], departmentId: 4, clinicId: 1, roomNumber: '501', status: 'active' },
  { id: 11, name: '陈医生', title: '主治医师', avatar: `${avatarBase}=chenlin`, specialties: ['角膜疾病', '眼睑疾病'], departmentId: 4, clinicId: 2, roomNumber: '502', status: 'active' },
  { id: 12, name: '褚医生', title: '主任医师', avatar: `${avatarBase}=chuyang`, specialties: ['过敏性皮炎', '真菌感染'], departmentId: 5, clinicId: 1, roomNumber: '601', status: 'active' },
  { id: 13, name: '卫医生', title: '主治医师', avatar: `${avatarBase}=weidong`, specialties: ['寄生虫皮肤病', '脱毛症'], departmentId: 5, clinicId: 3, roomNumber: '602', status: 'active' },
  { id: 14, name: '蒋医生', title: '副主任医师', avatar: `${avatarBase}=jiangmei`, specialties: ['牙周病', '牙齿矫正'], departmentId: 6, clinicId: 1, roomNumber: '701', status: 'active' },
  { id: 15, name: '沈医生', title: '主治医师', avatar: `${avatarBase}=shentao`, specialties: ['洗牙', '拔牙'], departmentId: 6, clinicId: 2, roomNumber: '702', status: 'active' },
  { id: 16, name: '韩医生', title: '主任医师', avatar: `${avatarBase}=hanxue`, specialties: ['猫泌尿综合征', '猫传染病'], departmentId: 7, clinicId: 1, roomNumber: '801', status: 'active' },
  { id: 17, name: '杨医生', title: '副主任医师', avatar: `${avatarBase}=yangfan`, specialties: ['猫慢性肾病', '猫糖尿病'], departmentId: 7, clinicId: 2, roomNumber: '802', status: 'active' },
  { id: 18, name: '朱医生', title: '主治医师', avatar: `${avatarBase}=zhulei`, specialties: ['猫行为问题', '猫老年病'], departmentId: 7, clinicId: 3, roomNumber: '803', status: 'active' },
  { id: 19, name: '秦医生', title: '副主任医师', avatar: `${avatarBase}=qinhui`, specialties: ['兔病', '啮齿类动物'], departmentId: 8, clinicId: 1, roomNumber: '901', status: 'active' },
  { id: 20, name: '尤医生', title: '主治医师', avatar: `${avatarBase}=youpeng`, specialties: ['鸟类', '爬行类动物'], departmentId: 8, clinicId: 2, roomNumber: '902', status: 'active' },
];

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const petAvatarBase = 'https://api.dicebear.com/7.x/thumbs/svg?seed';

export const petOwners: PetOwner[] = [
  { id: 1, name: '刘小明', phone: '13800138001' },
  { id: 2, name: '陈小红', phone: '13800138002' },
  { id: 3, name: '王小强', phone: '13800138003' },
  { id: 4, name: '赵小美', phone: '13800138004' },
  { id: 5, name: '孙大伟', phone: '13800138005' },
];

export const pets: Pet[] = [
  { id: 1, ownerId: 1, ownerPhone: '13800138001', name: '豆豆', species: '犬', breed: '金毛寻回犬', age: 3, gender: 'male', weight: 28.5, isNeutered: true, vaccineStatus: '已接种全部疫苗', avatar: `${petAvatarBase}=doudou` },
  { id: 2, ownerId: 1, ownerPhone: '13800138001', name: '咪咪', species: '猫', breed: '英国短毛猫', age: 2, gender: 'female', weight: 4.2, isNeutered: false, vaccineStatus: '已接种三联疫苗', avatar: `${petAvatarBase}=mimi` },
  { id: 3, ownerId: 2, ownerPhone: '13800138002', name: '旺财', species: '犬', breed: '柴犬', age: 4, gender: 'male', weight: 12.3, isNeutered: true, vaccineStatus: '已接种全部疫苗', avatar: `${petAvatarBase}=wangcai` },
  { id: 4, ownerId: 3, ownerPhone: '13800138003', name: '雪球', species: '猫', breed: '布偶猫', age: 1, gender: 'female', weight: 3.8, isNeutered: false, vaccineStatus: '已接种二联疫苗', avatar: `${petAvatarBase}=xueqiu` },
  { id: 5, ownerId: 4, ownerPhone: '13800138004', name: '小黑', species: '犬', breed: '边境牧羊犬', age: 5, gender: 'male', weight: 18.7, isNeutered: true, vaccineStatus: '已接种全部疫苗', avatar: `${petAvatarBase}=xiaohei` },
  { id: 6, ownerId: 5, ownerPhone: '13800138005', name: '灰灰', species: '兔', breed: '荷兰垂耳兔', age: 2, gender: 'female', weight: 2.1, isNeutered: false, vaccineStatus: '已接种兔瘟疫苗', avatar: `${petAvatarBase}=huihui` },
  { id: 7, ownerId: 5, ownerPhone: '13800138005', name: '小绿', species: '鸟', breed: '虎皮鹦鹉', age: 1, gender: 'male', weight: 0.035, isNeutered: false, vaccineStatus: '无需接种', avatar: `${petAvatarBase}=xiaolv` },
];

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let id = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = formatDate(addDays(today, dayOffset));
    for (const doctor of doctors) {
      const morningSlots = [
        ['09:00', '09:30'], ['09:30', '10:00'], ['10:00', '10:30'],
        ['10:30', '11:00'], ['11:00', '11:30'], ['11:30', '12:00'],
      ];
      const afternoonSlots = [
        ['14:00', '14:30'], ['14:30', '15:00'], ['15:00', '15:30'],
        ['15:30', '16:00'], ['16:00', '16:30'], ['16:30', '17:00'],
        ['17:00', '17:30'], ['17:30', '18:00'],
      ];
      const allSlots = [...morningSlots, ...afternoonSlots];

      for (const [startTime, endTime] of allSlots) {
        const booked = Math.floor(Math.random() * 6);
        const capacity = 5;
        let status: 'available' | 'full' | 'closed' = 'available';
        if (booked >= capacity) status = 'full';
        if (Math.random() < 0.05) status = 'closed';

        slots.push({
          id: id++,
          doctorId: doctor.id,
          date,
          startTime,
          endTime,
          capacity,
          booked: status === 'closed' ? 0 : booked,
          status,
        });
      }
    }
  }
  return slots;
}

export const timeSlots: TimeSlot[] = generateTimeSlots();

const todayStr = formatDate(new Date());

export const appointments: Appointment[] = [
  {
    id: 1,
    appointmentNo: 'APT202606210001',
    petId: 1,
    ownerPhone: '13800138001',
    ownerName: '刘小明',
    clinicId: 1,
    departmentId: 1,
    doctorId: 1,
    timeSlotId: 1,
    appointmentDate: todayStr,
    chiefComplaint: '最近食欲不振，呕吐两次',
    symptoms: ['食欲不振', '呕吐', '精神萎靡'],
    status: 'confirmed',
    createdAt: '2026-06-20T10:30:00Z',
  },
  {
    id: 2,
    appointmentNo: 'APT202606210002',
    petId: 3,
    ownerPhone: '13800138002',
    ownerName: '陈小红',
    clinicId: 1,
    departmentId: 1,
    doctorId: 1,
    timeSlotId: 2,
    appointmentDate: todayStr,
    chiefComplaint: '持续腹泻三天',
    symptoms: ['腹泻', '腹痛'],
    status: 'confirmed',
    createdAt: '2026-06-20T14:20:00Z',
  },
  {
    id: 3,
    appointmentNo: 'APT202606210003',
    petId: 2,
    ownerPhone: '13800138001',
    ownerName: '刘小明',
    clinicId: 1,
    departmentId: 7,
    doctorId: 16,
    timeSlotId: 200,
    appointmentDate: todayStr,
    chiefComplaint: '尿频，偶尔尿血',
    symptoms: ['尿频', '尿血', '排尿困难'],
    status: 'confirmed',
    createdAt: '2026-06-20T09:15:00Z',
  },
  {
    id: 4,
    appointmentNo: 'APT202606210004',
    petId: 4,
    ownerPhone: '13800138003',
    ownerName: '王小强',
    clinicId: 1,
    departmentId: 5,
    doctorId: 12,
    timeSlotId: 350,
    appointmentDate: todayStr,
    chiefComplaint: '皮肤瘙痒，经常抓挠',
    symptoms: ['皮肤瘙痒', '脱毛', '红斑'],
    status: 'confirmed',
    createdAt: '2026-06-20T16:45:00Z',
  },
  {
    id: 5,
    appointmentNo: 'APT202606210005',
    petId: 5,
    ownerPhone: '13800138004',
    ownerName: '赵小美',
    clinicId: 1,
    departmentId: 3,
    doctorId: 7,
    timeSlotId: 400,
    appointmentDate: todayStr,
    chiefComplaint: '右后腿跛行，不敢着地',
    symptoms: ['跛行', '疼痛', '关节肿胀'],
    status: 'confirmed',
    createdAt: '2026-06-20T11:00:00Z',
  },
  {
    id: 6,
    appointmentNo: 'APT202606210006',
    petId: 6,
    ownerPhone: '13800138005',
    ownerName: '孙大伟',
    clinicId: 2,
    departmentId: 8,
    doctorId: 19,
    timeSlotId: 500,
    appointmentDate: todayStr,
    chiefComplaint: '食欲不振，精神差',
    symptoms: ['食欲不振', '精神萎靡'],
    status: 'pending',
    createdAt: '2026-06-21T08:00:00Z',
  },
  {
    id: 7,
    appointmentNo: 'APT202606210007',
    petId: 1,
    ownerPhone: '13800138001',
    ownerName: '刘小明',
    clinicId: 1,
    departmentId: 6,
    doctorId: 14,
    timeSlotId: 600,
    appointmentDate: todayStr,
    chiefComplaint: '年度洗牙检查',
    symptoms: ['口臭', '牙结石'],
    status: 'completed',
    createdAt: '2026-06-19T10:00:00Z',
  },
];

const now = new Date();

export const registrations: Registration[] = [
  {
    id: 1,
    registrationNo: 'GH20260621-0001',
    appointmentId: 1,
    petId: 1,
    clinicId: 1,
    departmentId: 1,
    doctorId: 1,
    roomNumber: '101',
    queueNumber: 1,
    isEmergency: false,
    estimatedWaitTime: 0,
    status: 'visiting',
    checkedInAt: new Date(now.getTime() - 30 * 60000).toISOString(),
    calledAt: new Date(now.getTime() - 5 * 60000).toISOString(),
  },
  {
    id: 2,
    registrationNo: 'GH20260621-0002',
    appointmentId: 2,
    petId: 3,
    clinicId: 1,
    departmentId: 1,
    doctorId: 1,
    roomNumber: '101',
    queueNumber: 2,
    isEmergency: false,
    estimatedWaitTime: 20,
    status: 'waiting',
    checkedInAt: new Date(now.getTime() - 20 * 60000).toISOString(),
  },
  {
    id: 3,
    registrationNo: 'GH20260621-0003',
    appointmentId: 3,
    petId: 2,
    clinicId: 1,
    departmentId: 7,
    doctorId: 16,
    roomNumber: '801',
    queueNumber: 1,
    isEmergency: true,
    estimatedWaitTime: 0,
    status: 'visiting',
    checkedInAt: new Date(now.getTime() - 45 * 60000).toISOString(),
    calledAt: new Date(now.getTime() - 15 * 60000).toISOString(),
  },
  {
    id: 4,
    registrationNo: 'GH20260621-0004',
    appointmentId: 4,
    petId: 4,
    clinicId: 1,
    departmentId: 5,
    doctorId: 12,
    roomNumber: '601',
    queueNumber: 2,
    isEmergency: false,
    estimatedWaitTime: 35,
    status: 'waiting',
    checkedInAt: new Date(now.getTime() - 15 * 60000).toISOString(),
  },
  {
    id: 5,
    registrationNo: 'GH20260621-0005',
    appointmentId: 5,
    petId: 5,
    clinicId: 1,
    departmentId: 3,
    doctorId: 7,
    roomNumber: '401',
    queueNumber: 3,
    isEmergency: false,
    estimatedWaitTime: 50,
    status: 'waiting',
    checkedInAt: new Date(now.getTime() - 10 * 60000).toISOString(),
  },
  {
    id: 6,
    registrationNo: 'GH20260621-0006',
    appointmentId: 7,
    petId: 1,
    clinicId: 1,
    departmentId: 6,
    doctorId: 14,
    roomNumber: '701',
    queueNumber: 1,
    isEmergency: false,
    estimatedWaitTime: 0,
    status: 'completed',
    checkedInAt: new Date(now.getTime() - 120 * 60000).toISOString(),
    calledAt: new Date(now.getTime() - 100 * 60000).toISOString(),
    completedAt: new Date(now.getTime() - 60 * 60000).toISOString(),
  },
  {
    id: 7,
    registrationNo: 'GH20260621-0007',
    appointmentId: 0,
    petId: 6,
    clinicId: 1,
    departmentId: 1,
    doctorId: 2,
    roomNumber: '102',
    queueNumber: 1,
    isEmergency: true,
    estimatedWaitTime: 10,
    status: 'waiting',
    checkedInAt: new Date(now.getTime() - 5 * 60000).toISOString(),
  },
];
