import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const createdGym = await prisma.gym.create({
      data: {
        title: 'Gym name',
        description: 'Gym description',
        phone: '19999999999',
        latitude: -22.8231274,
        longitude: -47.1789586,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.8231274,
        longitude: -47.1789586,
      })

    expect(response.statusCode).toEqual(201)
  })
})
