import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    // In memory test database Pattern
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms by some param', async () => {
    await gymsRepository.create({
      title: 'Gym Name',
      description: null,
      phone: null,
      latitude: -22.8231274,
      longitude: -47.1789586,
    })

    await gymsRepository.create({
      title: 'This is not a gym',
      description: null,
      phone: null,
      latitude: -22.8231274,
      longitude: -47.1789586,
    })

    const { gyms } = await sut.execute({
      query: 'Name',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym Name' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 23; i++) {
      await gymsRepository.create({
        title: `Gym Name - ${i}`,
        description: null,
        phone: null,
        latitude: -22.8231274,
        longitude: -47.1789586,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym Name',
      page: 2,
    })

    expect(gyms).toHaveLength(3)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Name - 21' }),
      expect.objectContaining({ title: 'Gym Name - 22' }),
      expect.objectContaining({ title: 'Gym Name - 23' }),
    ])
  })
})
