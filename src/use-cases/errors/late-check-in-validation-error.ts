export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in must have a time gap small that 20 minutes.')
  }
}
