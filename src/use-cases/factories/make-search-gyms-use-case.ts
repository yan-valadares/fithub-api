import { SearchGymsUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymRepository)

  return useCase
}
