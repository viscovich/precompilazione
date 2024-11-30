import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';

// Use a specific version of PDF.js worker that matches our package version
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Initialize PDF.js worker
GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    if (pdf.numPages === 0) {
      throw new PDFProcessingError('PDF file is empty');
    }

    const textPromises = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      textPromises.push(extractPageText(pdf, i));
    }

    const pageTexts = await Promise.all(textPromises);
    return pageTexts.join('\n');
  } catch (error) {
    if (error instanceof PDFProcessingError) {
      throw error;
    }
    throw new PDFProcessingError(
      error instanceof Error ? error.message : 'Failed to process PDF file'
    );
  }
}

async function extractPageText(pdf: PDFDocumentProxy, pageNumber: number): Promise<string> {
  try {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    return textContent.items
      .map((item: any) => item.str)
      .join(' ');
  } catch (error) {
    throw new PDFProcessingError(`Failed to extract text from page ${pageNumber}`);
  }
}

export class PDFProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PDFProcessingError';
  }
}