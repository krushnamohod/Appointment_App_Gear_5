import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../context/AuthContext';
import { login } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginPage = () => {
  const { login: loginStore } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password);
    loginStore(res.data.user, res.data.token);
    toast.success('Logged in successfully');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <Input
          label="Email"
          type="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required'
          })}
        />

        <Input
          label="Password"
          type="password"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required'
          })}
        />

        <Button type="submit" loading={isSubmitting}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
