import { useEffect } from "react";

export default function Modal({ title, open, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        onMouseDown={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6">
        <div
          className="mx-auto w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-label={title || "Modal"}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div>
              {title ? (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

