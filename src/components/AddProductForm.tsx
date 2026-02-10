import { useState } from 'react';
import type { Product } from '../types/product';

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
        <h2 className="card-title">Добавить товар</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="title">Наименование</label>
            <input
              id="title"
              name="title"
              type="text"
              className={touched.title && errors.title ? 'input error' : 'input'}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.title && errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="price">Цена</label>
            <input
              id="price"
              name="price"
              type="text"
              inputMode="decimal"
              className={touched.price && errors.price ? 'input error' : 'input'}
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.price && errors.price && <span className="field-error">{errors.price}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="brand">Вендор</label>
            <input
              id="brand"
              name="brand"
              type="text"
              className={touched.brand && errors.brand ? 'input error' : 'input'}
              value={values.brand}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.brand && errors.brand && <span className="field-error">{errors.brand}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="sku">Артикул</label>
            <input
              id="sku"
              name="sku"
              type="text"
              className={touched.sku && errors.sku ? 'input error' : 'input'}
              value={values.sku}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.sku && errors.sku && <span className="field-error">{errors.sku}</span>}
          </div>

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

