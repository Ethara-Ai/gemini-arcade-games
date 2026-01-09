import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import classNames from 'classnames';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={classNames(
              'relative w-full max-w-lg overflow-hidden rounded-2xl border border-game-glass-border bg-game-dark/90 p-6 shadow-2xl ring-1 ring-white/10',
              className
            )}
            role="dialog"
            aria-modal="true"
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h2>
                )}
                {showCloseButton && onClose && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <IoMdClose size={24} />
                  </button>
                )}
              </div>
            )}
            <div className="text-gray-200">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

