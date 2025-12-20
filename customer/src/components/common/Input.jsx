import { forwardRef } from 'react';

/**
 * @intent Reusable input field with label and error display
 * @param {string} label - Input label text
 * @param {string} error - Error message to display
 * @param {boolean} required - Show required indicator
 */
const Input = forwardRef(({ label, error, required, ...props }, ref) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <input
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${error
          ? 'border-error focus:ring-error'
          : 'border-gray-300 focus:ring-primary'
        }`}
    />
    {error && <p className="text-sm text-error">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export default Input;

