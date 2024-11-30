import React from 'react';
import { Field } from '../types';
import { Button } from './ui/Button';

interface DynamicFormProps {
  fields: Field[];
  onChange: (fields: Field[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function DynamicForm({ fields, onChange, onProcess, isProcessing }: DynamicFormProps) {
  const handleFieldChange = (index: number, value: string | boolean | number) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? { ...field, value } : field
    );
    onChange(updatedFields);
  };

  const getFieldValue = (field: Field) => {
    if (field.value === undefined || field.value === null) {
      switch (field.type) {
        case 'text':
        case 'number':
        case 'select':
          return '';
        case 'checkbox':
          return false;
        default:
          return '';
      }
    }
    return field.value;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {fields.map((field, index) => (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === 'select' && field.options ? (
              <select
                value={getFieldValue(field) as string}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={getFieldValue(field) as boolean}
                onChange={(e) => handleFieldChange(index, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            ) : field.type === 'number' ? (
              <input
                type="number"
                value={getFieldValue(field) as string}
                onChange={(e) => handleFieldChange(index, e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                value={getFieldValue(field) as string}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onProcess} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Process with OpenRouter'}
        </Button>
      </div>
    </div>
  );
}