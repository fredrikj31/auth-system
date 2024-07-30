interface ApiErrorOptions {
  statusCode: number;
  code: string;
  message: string;
}

export class ApiError {
  public statusCode: number;
  public code: string;
  public message: string;

  constructor({ statusCode, code, message }: ApiErrorOptions) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }
}
