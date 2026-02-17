import { useForm } from '../hooks/useForm';
import { useModal } from '../hooks/useModal';
import type { Product, AddProductFormValues } from '../types/product';
import { TextInputField } from './ui/TextInputField';
import { ClearIcon } from './icons/ClearIcon';
import { createProductValidator } from '../utils/productValidation';
import { createProductFromForm } from '../utils/productFactory';
import { addProductFormFields } from '../config/formFields';

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
      const newProduct = createProductFromForm(values);
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
          {addProductFormFields.map((field) => (
            <TextInputField
              key={field.name}
              name={field.name}
              label={field.label}
              value={values[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors[field.name]}
              touched={touched[field.name]}
              type={field.type}
            />
          ))}

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
