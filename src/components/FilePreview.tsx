import React from 'react';
import { FileText, File, X } from 'lucide-react';

interface FilePreviewProps {
  fileName: string;
  fileType: 'json' | 'pdf';
  onRemove: () => void;
}

export function FilePreview({ fileName, fileType, onRemove }: FilePreviewProps) {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {fileType === 'pdf' ? (
          <FileText className="h-6 w-6 text-red-500" />
        ) : (
          <File className="h-6 w-6 text-blue-500" />
        )}
        <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
          {fileName}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        aria-label="Remove file"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}