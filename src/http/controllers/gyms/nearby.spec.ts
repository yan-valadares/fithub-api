import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Nearby Gyms Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym name',
        description: 'Gym description',
        phone: '19999999999',
        latitude: -22.8231274,
        longitude: -47.1789586,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Another gym name',
        description: 'Gym description',
        phone: '19999999999',
        latitude: -23.5417101,
        longitude: -46.6648635,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.8231274,
        longitude: -47.1789586,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Gym name',
      }),
    ])
  })
})
