import { ErrorCode, AppError } from "@/types/errors";

export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, string[]>,
): AppError {
  return { code, message, details };
}

export function parseUnknownError(error: unknown): AppError {
  if (error instanceof Error) {
    return createError("CMS_SYNC_FAILED", error.message);
  }
  return createError("CMS_SYNC_FAILED", "An unexpected system error occurred.");
}
