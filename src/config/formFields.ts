import type { AddProductFormValues } from '../types/product';

export interface FormFieldConfig {
  name: keyof AddProductFormValues;
  label: string;
  type?: 'text' | 'number';
}

export const addProductFormFields: FormFieldConfig[] = [
  {
    name: 'title',
    label: 'Наименование',
  },
  {
    name: 'price',
    label: 'Цена',
    type: 'number',
  },
  {
    name: 'brand',
    label: 'Вендор',
  },
  {
    name: 'sku',
    label: 'Артикул',
  },
];
