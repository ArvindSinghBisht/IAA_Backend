export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export class InfrastructureError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "InfrastructureError";
  }
}
