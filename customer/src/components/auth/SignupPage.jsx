import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    await signup(data);
    toast.success('OTP sent to email');
    navigate('/verify-otp', { state: { email: data.email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <Input
          label="Full Name"
          required
          error={errors.name?.message}
          {...register('name', { required: 'Name required' })}
        />

        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register('email', { required: 'Email required' })}
        />

        <Input
          label="Phone"
          required
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Must be 10 digits'
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password required',
            pattern: {
              value:
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
              message: 'Weak password'
            }
          })}
        />

        <Button type="submit" loading={isSubmitting}>
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignupPage;