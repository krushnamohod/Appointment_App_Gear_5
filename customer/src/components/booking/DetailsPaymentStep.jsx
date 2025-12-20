import { useForm } from 'react-hook-form';
import { createBooking } from '../../services/appointmentService';
import { useBookingStore } from '../../context/BookingContext';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DetailsPaymentStep = () => {
  const navigate = useNavigate();
  const { booking, resetBooking, setStep } =
    useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    await createBooking({
      ...booking,
      details: data
    });
    toast.success('Appointment booked');
    resetBooking();
    navigate('/confirmation');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <input
        {...register('phone', {
          required: 'Phone required'
        })}
        placeholder="Phone number"
        className="border p-2 rounded w-full"
      />
      {errors.phone && (
        <p className="text-error">
          {errors.phone.message}
        </p>
      )}

      <textarea
        {...register('reason', {
          required: 'Reason required'
        })}
        placeholder="Reason for visit"
        className="border p-2 rounded w-full"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" required /> I agree to
        terms
      </label>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep(3)}
        >
          Back
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Confirm Booking
        </Button>
      </div>
    </form>
  );
};

export default DetailsPaymentStep;
