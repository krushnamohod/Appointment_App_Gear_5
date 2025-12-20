import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { forgotPassword } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async ({ email }) => {
    await forgotPassword(email);
    toast.success('Reset link sent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          Forgot Password
        </h1>

        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register('email', { required: 'Email required' })}
        />

        <Button type="submit" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
