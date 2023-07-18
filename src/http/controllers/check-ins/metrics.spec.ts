import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in Metrics Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list the metrics of an user', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const createdGym = await prisma.gym.create({
      data: {
        title: 'Gym name',
        description: 'Gym description',
        phone: '19999999999',
        latitude: -22.8231274,
        longitude: -47.1789586,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: createdGym.id,
          user_id: user.id,
        },
        {
          gym_id: createdGym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkInsCount).toEqual(2)
  })
})
