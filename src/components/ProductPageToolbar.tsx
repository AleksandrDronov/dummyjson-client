import { PlusIcon } from './icons/PlusIcon';
import { ArrowsIcon } from './icons/ArrowsIcon';

interface ProductPageToolbarProps {
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export function ProductPageToolbar({ onRefresh, onOpenAddModal }: ProductPageToolbarProps) {
  return (
    <div className="toolbar">
      <h2>Все позиции</h2>
      <button
        type="button"
        className="button secondary small"
        onClick={onRefresh}
        title="Обновить"
        aria-label="Обновить список товаров"
      >
        <ArrowsIcon />
      </button>
      <button type="button" className="button primary small" onClick={onOpenAddModal}>
        <PlusIcon />
        Добавить
      </button>
    </div>
  );
}
