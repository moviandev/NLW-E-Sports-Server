import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

import { convertHourStringToMinutes } from './utils/convertHourStringToMinutes';
import { convertMinutesToHourString } from './utils/convertMinutesToHourString';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));

const prisma = new PrismaClient();
// implementar zod para validacao
app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return res.json(games);
});

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;
  const body = req.body;

  const ad = await prisma.ad.create({
    data: {
      name: body.name,
      hourEnd: convertHourStringToMinutes(body.hourEnd),
      hoursStart: convertHourStringToMinutes(body.hoursStart),
      weekDays: body.weekDays.join(','),
      yearsPlaying: body.yearsPlaying,
      gameId,
      discord: body.discord,
      useVoiceChannel: body.useVoiceChannel
    }
  })

  return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req: any, res: any) => {
  const gameId = req.params.id;
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      yearsPlaying: true,
      hoursStart: true,
      hourEnd: true,
      useVoiceChannel: true
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return res.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hoursStart: convertMinutesToHourString(ad.hoursStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd),
    }
  }))
});

app.get('/ads/:id/discord', async (req: any, res: any) => {
  const adId = req.params.id;
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId,
    }
  });

  return res.json({
    discord: ad.discord
  });
});

app.listen(3333);
