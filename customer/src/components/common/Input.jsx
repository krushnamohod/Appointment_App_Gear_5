const Input = ({ label, error, required, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? 'border-error focus:ring-error'
          : 'border-gray-300 focus:ring-primary'
      }`}
    />
    {error && <p className="text-sm text-error">{error}</p>}
  </div>
);

export default Input;
