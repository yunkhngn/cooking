"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}: CustomModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative z-10 w-full max-w-md overflow-hidden rounded-card border border-hairline bg-surface p-6 shadow-card ${className}`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              {title ? (
                <h3 className="text-lg font-bold text-ink">{title}</h3>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="rounded-full p-1.5 text-ink-muted transition hover:bg-hairline hover:text-ink"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="py-4 text-sm text-ink-muted leading-relaxed">
              {children}
            </div>

            {footer && (
              <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
