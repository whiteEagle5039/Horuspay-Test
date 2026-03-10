import { X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const alertStyles: Record<AlertProps['type'], string> = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm ${alertStyles[type]}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 p-0.5 rounded hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
