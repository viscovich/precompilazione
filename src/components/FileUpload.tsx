import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  label: string;
}

export function FileUpload({ onFileSelect, accept, label }: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: files => files[0] && onFileSelect(files[0]),
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? 'Drop the file here' : label}
      </p>
    </div>
  );
}