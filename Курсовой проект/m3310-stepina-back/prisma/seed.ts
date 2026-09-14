import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.scheduleSlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.horse.deleteMany();
  await prisma.user.deleteMany();

  await prisma.service.createMany({
    data: [
      {
        title: 'Уроки для начинающих',
        description:
          'Занятия с тренером: основы посадки и управления, шаг/рысь. Малые группы (3-4) или индивидуально. Продолжительность 1:30. Подходят взрослым и детям.',
        priceRub: 3200,
      },
      {
        title: 'Спортивные программы',
        description:
          'Выездка и конкур: от базовых упражнений до соревновательных маршрутов. Малые группы (3-4) или индивидуально. Продолжительность 1:30. Для продвинутых всадников.',
        priceRub: 3200,
      },
      {
        title: 'Конные прогулки',
        description:
          'Маршруты по прогулочным тропам. Продолжительность 45 минут. Набор группы 3-6 человек. Краткий инструктаж перед выездом.',
        priceRub: 3200,
      },
      {
        title: 'Открытые старты',
        description:
          'Соревновательный день/мероприятие клуба (по расписанию).',
        priceRub: null,
      },
    ],
  });

  await prisma.horse.createMany({
    data: [
      {
        name: 'Шторм',
        gender: 'жеребец',
        breed: 'чистокровная верховая',
        photoUrl: '/img/storm.jpg',
      },
      {
        name: 'Микай',
        gender: 'жеребец',
        breed: 'английская чистокровная',
        photoUrl: '/img/mikaya.jpg',
      },
    ],
  });

  await prisma.scheduleSlot.createMany({
    data: [
      {
        title: 'Пн 14:00–15:30 - Уроки для начинающих (Сандра)',
        startAt: new Date('2026-03-09T14:00:00.000Z'),
        endAt: new Date('2026-03-09T15:30:00.000Z'),
      },
      {
        title: 'Вт 18:00–19:30 - Индивидуальное занятие (Дарья)',
        startAt: new Date('2026-03-10T18:00:00.000Z'),
        endAt: new Date('2026-03-10T19:30:00.000Z'),
      },
      {
        title: 'Ср 16:00–17:00 - Конные прогулки (Сандра)',
        startAt: new Date('2026-03-11T16:00:00.000Z'),
        endAt: new Date('2026-03-11T17:00:00.000Z'),
      },
      {
        title: 'Пт 19:00–20:30 - Индивидуальное занятие (Дарья)',
        startAt: new Date('2026-03-13T19:00:00.000Z'),
        endAt: new Date('2026-03-13T20:30:00.000Z'),
      },
      {
        title: 'Сб 12:00–15:00 - Открытые старты',
        startAt: new Date('2026-03-14T12:00:00.000Z'),
        endAt: new Date('2026-03-14T15:00:00.000Z'),
      },
    ],
  });

  const darya = await prisma.user.create({
    data: { name: 'Дарья', email: 'daria@example.com' },
  });

  const sandra = await prisma.user.create({
    data: { name: 'Сандра', email: 'sandra@example.com' },
  });

  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  const horses = await prisma.horse.findMany({ orderBy: { id: 'asc' } });
  const slots = await prisma.scheduleSlot.findMany({ orderBy: { id: 'asc' } });

  const serviceBeginners = services.find((s) => s.title === 'Уроки для начинающих')!;
  const serviceSport = services.find((s) => s.title === 'Спортивные программы')!;
  const serviceRide = services.find((s) => s.title === 'Конные прогулки')!;
  const serviceStarts = services.find((s) => s.title === 'Открытые старты')!;

  const horseStorm = horses.find((h) => h.name === 'Шторм')!;
  const horseMikai = horses.find((h) => h.name === 'Микай')!;

  const slotMon = slots.find((x) => x.title.startsWith('Пн'))!;
  const slotTue = slots.find((x) => x.title.startsWith('Вт'))!;
  const slotWed = slots.find((x) => x.title.startsWith('Ср'))!;
  const slotFri = slots.find((x) => x.title.startsWith('Пт'))!;
  const slotSat = slots.find((x) => x.title.startsWith('Сб'))!;

  await prisma.booking.createMany({
    data: [
      {
        date: slotMon.startAt,
        status: BookingStatus.COMPLETED,
        userId: sandra.id,
        serviceId: serviceBeginners.id,
        horseId: horseStorm.id,
        slotId: slotMon.id,
      },
      {
        date: slotTue.startAt,
        status: BookingStatus.CONFIRMED,
        userId: darya.id,
        serviceId: serviceSport.id,
        horseId: horseMikai.id,
        slotId: slotTue.id,
      },
      {
        date: slotWed.startAt,
        status: BookingStatus.NEW,
        userId: sandra.id,
        serviceId: serviceRide.id,
        horseId: horseStorm.id,
        slotId: slotWed.id,
      },
      {
        date: slotSat.startAt,
        status: BookingStatus.NEW,
        userId: darya.id,
        serviceId: serviceStarts.id,
        // для стартов лошадь может быть не фиксирована
        horseId: null,
        slotId: slotSat.id,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        fullName: 'Дарья',
        email: 'daria@example.com',
        comment: 'Очень атмосферный клуб, приходите к нам!',
        userId: darya.id,
      },
      {
        fullName: 'Сандра',
        email: 'sandra@example.com',
        comment: 'От работы дохнут кони, только я железный пони.',
        userId: sandra.id,
      },
      {
        fullName: 'Гость',
        email: 'guest@example.com',
        comment: 'Был на прогулке - всё супер.',
        userId: null,
      },
    ],
  });

  console.log('Данные добавлены успешно!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Ошибка:', e);
    await prisma.$disconnect();
    process.exit(1);
  });