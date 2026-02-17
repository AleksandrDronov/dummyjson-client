import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import type { Product, AddProductFormValues } from '../types/product';
import { TextInputField } from './ui/TextInputField';
import { ClearIcon } from './icons/ClearIcon';
import { createProductValidator } from '../utils/productValidation';

interface AddProductFormProps {
  onProductAdded: (product: Product) => void;
  onClose: () => void;
}

interface AddProductFormErrors extends Record<string, string | undefined> {
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

const generateId = () => -(Date.now() + Math.random());
const validate = createProductValidator();

export function AddProductForm({ onProductAdded, onClose }: AddProductFormProps) {
  const { isOpen, isClosing, handleClose, handleBackdropClick } = useModal({ onClose });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm<
    AddProductFormValues,
    AddProductFormErrors
  >({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const priceNumber = Number(values.price.replace(',', '.'));
      const productId = generateId();

      const newProduct: Product = {
        id: productId,
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
      handleClose();
    },
    getAllTouched: () => ({ title: true, price: true, brand: true, sku: true }),
  });

  return (
    <div
      className={`modal-backdrop ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`card modal ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
      >
        <div className="modal-header">
          <h2 className="modal-title">Добавить товар</h2>
          <button
            className="close-modal-btn"
            onClick={handleClose}
            aria-label="Закрыть модальное окно"
          >
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
            <button type="button" className="button secondary" onClick={handleClose}>
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
