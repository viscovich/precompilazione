import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FileUploadBox } from './components/FileUploadBox';
import { DynamicForm } from './components/DynamicForm';
import { ConfigForm } from './components/ConfigForm';
import { extractTextFromPDF } from './utils/pdfUtils';
import { processWithOpenRouter } from './utils/openRouterApi';
import { getErrorMessage } from './utils/errorUtils';
import { Field, OpenRouterConfig } from './types';

function App() {
  const [fields, setFields] = useState<Field[]>([]);
  const [config, setConfig] = useState<OpenRouterConfig>({
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleJSONUpload = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      
      if (!Array.isArray(json.fields)) {
        throw new Error('Invalid JSON format: missing fields array');
      }
      
      const initializedFields = json.fields.map((field: Field) => ({
        ...field,
        value: field.type === 'checkbox' ? false : '',
      }));
      
      setFields(initializedFields);
      setJsonFile(file);
      toast.success('JSON schema loaded successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const text = await extractTextFromPDF(file);
      setPdfText(text);
      setPdfFile(file);
      toast.success('PDF loaded successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleProcess = async () => {
    if (!config.model) {
      toast.error('Please select a model first');
      return;
    }

    if (fields.length === 0) {
      toast.error('Please upload a JSON schema first');
      return;
    }

    if (!pdfText) {
      toast.error('Please upload a PDF file first');
      return;
    }

    setIsProcessing(true);
    try {
      const extractedData = await processWithOpenRouter(pdfText, fields, config);
      
      const updatedFields = fields.map(field => ({
        ...field,
        value: extractedData[field.name] ?? (field.type === 'checkbox' ? false : ''),
      }));
      setFields(updatedFields);
      toast.success('Data extracted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveJSON = () => {
    setJsonFile(null);
    setFields([]);
  };

  const handleRemovePDF = () => {
    setPdfFile(null);
    setPdfText(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Document Processing App
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">OpenRouter Configuration</h2>
          <ConfigForm config={config} onConfigChange={setConfig} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FileUploadBox
            title="Upload JSON Schema"
            accept={{ 'application/json': ['.json'] }}
            onFileSelect={handleJSONUpload}
            selectedFile={jsonFile}
            onFileRemove={handleRemoveJSON}
            fileType="json"
          />

          <FileUploadBox
            title="Upload PDF Document"
            accept={{ 'application/pdf': ['.pdf'] }}
            onFileSelect={handlePDFUpload}
            selectedFile={pdfFile}
            onFileRemove={handleRemovePDF}
            fileType="pdf"
          />
        </div>

        {fields.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dynamic Form</h2>
            <DynamicForm 
              fields={fields} 
              onChange={setFields} 
              onProcess={handleProcess}
              isProcessing={isProcessing}
            />
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;