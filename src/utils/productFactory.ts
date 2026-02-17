import type { Product, AddProductFormValues } from '../types/product';

export const generateProductId = () => -(Date.now() + Math.random());

export const createProductFromForm = (values: AddProductFormValues): Product => {
  const priceNumber = Number(values.price.replace(',', '.'));

  return {
    id: generateProductId(),
    title: values.title.trim(),
    brand: values.brand.trim(),
    sku: values.sku.trim(),
    price: priceNumber,
    rating: 0,
    stock: 0,
    category: 'custom',
    thumbnail: '',
  };
};
