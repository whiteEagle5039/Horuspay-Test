import { forwardRef } from 'react';

type BaseProps = {
  label?: string;
  error?: string;
  multiline?: boolean;
};

type InputProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>;
type TextareaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps>;

type FormInputProps = InputProps | TextareaProps;

export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(({ label, error, multiline = false, ...rest }, ref) => {
  const baseClasses = `w-full bg-slate-700 border text-white rounded-lg px-3 py-2 text-sm placeholder-slate-400 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 ${
    error ? 'border-red-500' : 'border-slate-600'
  }`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-slate-300">{label}</label>
      )}
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`${baseClasses} min-h-[80px] resize-y`}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={baseClasses}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="block text-xs text-red-500">{error}</span>}
    </div>
  );
});

FormInput.displayName = 'FormInput';
