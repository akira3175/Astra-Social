import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    fullWidth?: boolean;
    hideCloseButton?: boolean;
    actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    maxWidth = "sm",
    fullWidth = true,
    hideCloseButton = false,
    actions,
}) => {
    // Handle escape key
    const handleEscape = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // Handle click outside
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [open, handleEscape]);

    if (!open) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                className={`modal-container size-${maxWidth} ${fullWidth ? "fullWidth" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
            >
                {title && (
                    <div className="modal-header">
                        <h2 id="modal-title" className="modal-title">
                            {title}
                        </h2>
                        {!hideCloseButton && (
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
                <div className="modal-content">{children}</div>
                {actions && <div className="modal-actions">{actions}</div>}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
