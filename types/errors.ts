export type ErrorCode =
  | "AUTH_UNAUTHORIZED"
  | "DB_FETCH_FAILED"
  | "CMS_SYNC_FAILED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND";

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, string[]>; // For Zod validation errors
}

export type ActionResponse<T = void> =
  | { success: true; data: T; error?: never }
  | { success: false; error: AppError; data?: never };
