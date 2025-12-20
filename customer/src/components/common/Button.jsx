const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  ...props
}) => {
  const base =
    'w-full py-2 px-4 rounded-md font-medium transition focus:outline-none focus:ring-2';
  const variants = {
    primary:
      'bg-primary text-white hover:bg-blue-600 focus:ring-primary',
    secondary:
      'bg-secondary text-white hover:bg-indigo-600 focus:ring-secondary',
    danger:
      'bg-error text-white hover:bg-red-600 focus:ring-error'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${
        loading && 'opacity-70 cursor-not-allowed'
      }`}
      {...props}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
