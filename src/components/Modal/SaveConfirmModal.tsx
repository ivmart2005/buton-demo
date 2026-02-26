import { FC } from 'react';
import Modal from './Modal';
import { ModalButton } from './types';
import './Modal.css';

interface SaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onDiscard: () => void;
}

const SaveConfirmModal: FC<SaveConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onSaveAs, 
  onDiscard 
}) => {
  
  const buttons: ModalButton[] = [
    { 
      label: 'Сохранить', 
      variant: 'primary', 
      onClick: () => { onSave(); onClose(); } 
    },
    { 
      label: 'Сохранить как...', 
      variant: 'primary', 
      onClick: () => { onSaveAs(); onClose(); } 
    },
    { 
      label: 'Не сохранять', 
      variant: 'danger',
      onClick: () => { onDiscard(); onClose(); } 
    }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Несохраненные изменения"
    >
      <div className="confirm-dialog">
        <p className="confirm-dialog-message">
          В букете есть несохраненные изменения. Сохранить их?
        </p>
        <div className="confirm-dialog-actions">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={`modal-btn btn-${btn.variant || 'secondary'}`}
              onClick={btn.onClick}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SaveConfirmModal;