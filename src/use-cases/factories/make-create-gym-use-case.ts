import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymRepository)

  return useCase
}
