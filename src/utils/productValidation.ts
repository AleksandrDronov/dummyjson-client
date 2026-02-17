import { createValidator } from './validation';
import type { AddProductFormValues } from '../types/product';

export const createProductValidator = () => createValidator<AddProductFormValues>({
  title: {
    required: true,
    message: 'Введите наименование',
  },
  brand: {
    required: true,
    message: 'Введите вендора',
  },
  sku: {
    required: true,
    message: 'Введите артикул',
  },
  price: {
    required: true,
    message: 'Введите корректную цену',
    validate: (value) => {
      const priceNumber = Number(String(value).replace(',', '.'));
      if (!String(value).trim() || Number.isNaN(priceNumber) || priceNumber <= 0) {
        return 'Введите корректную цену';
      }
      return undefined;
    },
  },
});
