// errors/BadRequestError.ts
export class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError);
    }
  }
}

// errors/UnauthorizedError.ts
export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string = "Unauthorized Access") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError);
    }
  }
}

// errors/ForbiddenError.ts
export class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string = "Forbidden Access") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenError);
    }
  }
}

// errors/NotFoundError.ts
export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string = "Resource Not Found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
  }
}

// errors/ConflictError.ts
export class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string = "Conflict") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConflictError);
    }
  }
}

// errors/InternalServerError.ts
export class InternalServerError extends Error {
  public statusCode: number;

  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InternalServerError);
    }
  }
}

// errors/ServiceUnavailableError.ts
export class ServiceUnavailableError extends Error {
  public statusCode: number;

  constructor(message: string = "Service Unavailable") {
    super(message);
    this.name = "ServiceUnavailableError";
    this.statusCode = 503;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceUnavailableError);
    }
  }
}
