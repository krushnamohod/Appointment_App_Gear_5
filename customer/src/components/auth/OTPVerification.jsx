import { useForm } from 'react-hook-form';
import { verifyOTP } from '../../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async ({ otp }) => {
    try {
      await verifyOTP(state.email, otp);
      toast.success('Account verified');
      navigate('/login');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Verify OTP</h1>

        <Input
          label="6-digit OTP"
          required
          error={errors.otp?.message}
          {...register('otp', {
            required: 'OTP required',
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Invalid OTP'
            }
          })}
        />

        <Button type="submit" loading={isSubmitting}>
          Verify
        </Button>
      </form>
    </div>
  );
};

export default OTPVerification;
