import React from 'react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';

interface FileUploadBoxProps {
  title: string;
  accept: Record<string, string[]>;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onFileRemove: () => void;
  fileType: 'json' | 'pdf';
}

export function FileUploadBox({
  title,
  accept,
  onFileSelect,
  selectedFile,
  onFileRemove,
  fileType,
}: FileUploadBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {selectedFile ? (
        <FilePreview
          fileName={selectedFile.name}
          fileType={fileType}
          onRemove={onFileRemove}
        />
      ) : (
        <FileUpload
          onFileSelect={onFileSelect}
          accept={accept}
          label={`Drop ${fileType.toUpperCase()} file here or click to upload`}
        />
      )}
    </div>
  );
}