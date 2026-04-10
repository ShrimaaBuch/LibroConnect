// ============================================================
// AlertToast.jsx – Floating Alert Notification
// ============================================================
import React, { useEffect } from 'react';

const AlertToast = ({ alert, onClose }) => {
  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert, onClose]);

  if (!alert) return null;

  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div className={`alert alert-${alert.type} alert-float d-flex align-items-center`} role="alert">
      <i className={`bi ${icons[alert.type] || icons.info} me-2`}></i>
      <span>{alert.msg}</span>
      <button
        type="button"
        className="btn-close ms-auto"
        onClick={onClose}
        aria-label="Close"
      ></button>
    </div>
  );
};

export default AlertToast;
