import { useState, useEffect, useRef } from 'react';
import '../styles/components/_lightbox.scss';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  description: string;
}

// Модальне вікно перегляду зображень на основі стандарту HTMLDialogElement
function Lightbox({ isOpen, onClose, imageUrl, title, description }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Закриття при кліку на область бекдропу (за межами контентної частини діалогу)
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || e.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isInside = (
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right
    );

    if (!isInside) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      {...({ closedby: 'any' } as any)}
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <div className="lightbox-dialog__content">
        <button
          className="lightbox-dialog__close"
          onClick={onClose}
          aria-label="Закрити модальне вікно"
          type="button"
          autoFocus
        >
          ✕
        </button>
        <div className="lightbox-dialog__image-wrapper">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={title}
              className="lightbox-dialog__image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="lightbox-dialog__image-placeholder">
              <span>Зображення відсутнє</span>
            </div>
          )}
        </div>
        <div className="lightbox-dialog__info">
          <h3 id="lightbox-title" className="lightbox-dialog__title">{title}</h3>
          <p className="lightbox-dialog__description">{description}</p>
        </div>
      </div>
    </dialog>
  );
}

export default Lightbox;
