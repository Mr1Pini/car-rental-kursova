import axios from "axios";

interface ApiErrorBody {
  message?: string;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Сталася помилка",
): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const msg = error.response?.data?.message;
    if (typeof msg === "string" && msg.length > 0) return msg;
    if (!error.response) {
      return "Немає з'єднання з сервером. Перевірте, чи запущений backend.";
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
