"use client";

import { motion } from "framer-motion";

export interface CustomAlertProps {
  variant?: "error" | "warning" | "info" | "success";
  title?: string;
  children: React.ReactNode;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export function CustomAlert({
  variant = "error",
  title,
  children,
  onRetry,
  retryText = "Thử lại",
  className = "",
}: CustomAlertProps) {
  const isError = variant === "error";

  const styles = {
    error: {
      container: "bg-coral-tint border-coral/20 text-ink",
      iconBg: "bg-coral/10 text-coral",
      button: "bg-coral text-white hover:brightness-105",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-ink",
      iconBg: "bg-amber-100 text-amber-600",
      button: "bg-amber-600 text-white hover:bg-amber-700",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    info: {
      container: "bg-teal-tint border-teal/20 text-ink",
      iconBg: "bg-teal/10 text-teal",
      button: "bg-teal text-white hover:brightness-105",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    success: {
      container: "bg-teal-tint border-teal/30 text-ink",
      iconBg: "bg-teal/20 text-teal",
      button: "bg-teal text-white hover:brightness-105",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  }[variant];

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`rounded-card border p-5 shadow-card sm:p-6 ${styles.container} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 rounded-full p-2.5 ${styles.iconBg}`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          {title && <h4 className="mb-1 text-base font-bold text-ink">{title}</h4>}
          <div className="text-sm font-medium text-ink-muted leading-relaxed">
            {children}
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`mt-4 rounded-control px-5 py-2.5 text-sm font-semibold shadow-sm transition ${styles.button}`}
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
