export class ConflictError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ConflictError'
    this.statusCode = 409 // HTTP status code for Conflict

    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name - 'NotFoundError'
    this.statusCode = 404 // HTTP status code for Not Found
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
