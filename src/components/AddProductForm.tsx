import { useState } from 'react';
import type { Product } from '../types/product';
import { TextInputField } from './TextInputField';
import { ClearIcon } from './icons/ClearIcon';

interface AddProductFormProps {
  onProductAdded: (product: Product) => void;
  onClose: () => void;
}

interface AddProductFormValues {
  title: string;
  price: string;
  brand: string;
  sku: string;
}

interface AddProductFormErrors {
  title?: string;
  price?: string;
  brand?: string;
  sku?: string;
}

const initialValues: AddProductFormValues = {
  title: '',
  price: '',
  brand: '',
  sku: '',
};

export function AddProductForm({ onProductAdded, onClose }: AddProductFormProps) {
  const [values, setValues] = useState<AddProductFormValues>(initialValues);
  const [errors, setErrors] = useState<AddProductFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof AddProductFormValues, boolean>>({
    title: false,
    price: false,
    brand: false,
    sku: false,
  });

  const validate = (current: AddProductFormValues): AddProductFormErrors => {
    const next: AddProductFormErrors = {};
    if (!current.title.trim()) {
      next.title = 'Введите наименование';
    }
    if (!current.brand.trim()) {
      next.brand = 'Введите вендора';
    }
    if (!current.sku.trim()) {
      next.sku = 'Введите артикул';
    }
    const priceNumber = Number(current.price.replace(',', '.'));
    if (!current.price.trim() || Number.isNaN(priceNumber) || priceNumber <= 0) {
      next.price = 'Введите корректную цену';
    }
    return next;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      ...validate(values),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({
      title: true,
      price: true,
      brand: true,
      sku: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const priceNumber = Number(values.price.replace(',', '.'));

    const newProduct: Product = {
      id: -Date.now(),
      title: values.title.trim(),
      brand: values.brand.trim(),
      sku: values.sku.trim(),
      price: priceNumber,
      rating: 0,
      stock: 0,
      category: 'custom',
      thumbnail: '',
    };

    onProductAdded(newProduct);
    setValues(initialValues);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal">
        <div className="modal-header">
          <h2 className="modal-title">Добавить товар</h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Закрыть модальное окно">
            <ClearIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <TextInputField
            name="title"
            label="Наименование"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.title}
            touched={touched.title}
          />

          <TextInputField
            name="price"
            label="Цена"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.price}
            touched={touched.price}
          />

          <TextInputField
            name="brand"
            label="Вендор"
            value={values.brand}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.brand}
            touched={touched.brand}
          />

          <TextInputField
            name="sku"
            label="Артикул"
            value={values.sku}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.sku}
            touched={touched.sku}
          />

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="button primary">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
