export class PDFProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}

export class APIProcessingError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIProcessingError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof PDFProcessingError) {
    return `PDF Processing Error: ${error.message}`;
  }
  if (error instanceof APIProcessingError) {
    const statusText = error.statusCode ? ` (Status: ${error.statusCode})` : '';
    return `API Error: ${error.message}${statusText}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}