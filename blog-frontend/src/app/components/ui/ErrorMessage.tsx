interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = "Ошибка загрузки", message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-600 text-lg font-semibold mb-2">{title}</div>
      <div className="text-red-500">{message}</div>
    </div>
  );
}