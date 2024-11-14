import React from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-3xl">
        <button
          className="absolute right-2 top-2 text-black hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
