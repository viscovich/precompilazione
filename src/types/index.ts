export interface Field {
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'select';
  label: string;
  options?: string[];
  value?: string | number | boolean;
}

export interface FormData {
  fields: Field[];
}

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
}