interface ApiErrorMessageProps {
  message?: string;
}

export function ApiErrorMessage({ message }: ApiErrorMessageProps) {
  if (!message) return null;

  return <div className="form-error">{message}</div>;
}
