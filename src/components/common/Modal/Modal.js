import React from 'react';
import styles from './Modal.module.css'; // Import CSS module styles

// Modal component definition
const Modal = ({ isOpen, onClose, title, children }) => {
  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    // Overlay background - clicking on this will close the modal
    <div className={styles.overlay} onClick={onClose}>
      {/* Modal container - stop propagation to prevent closing when clicking inside the modal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal header section with title and close button */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {/* Close button - triggers onClose handler when clicked */}
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        
        {/* Modal content area where any children elements are rendered */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; // Export the Modal component
