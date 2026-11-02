import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/** Accessible custom modal dialog (replaces window.alert / confirm). */
export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`card relative z-10 my-8 w-full animate-rise p-6 shadow-2xl sm:p-8 ${wide ? 'max-w-xl' : 'max-w-md'}`}>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-mute hover:text-amber" aria-label="Close">
          <FaTimes />
        </button>
        <h3 className="pr-8 font-display text-2xl font-bold">{title}</h3>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', busy = false, danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="leading-relaxed text-mute">{message}</p>
      <div className="mt-7 flex justify-end gap-3">
        <button onClick={onClose} className="btn-ghost btn-sm" disabled={busy}>Keep it</button>
        <button onClick={onConfirm} disabled={busy} className={`btn btn-sm ${danger ? 'bg-red-500 text-white hover:bg-red-400' : 'btn-primary'}`}>
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
