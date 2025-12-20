import { ArrowLeft, CreditCard, FileText, Mail, MapPin, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../context/AuthContext';
import { useBookingStore } from '../../context/BookingContext';
import { createBooking } from '../../services/appointmentService';

/**
 * @intent Paper Planner styled details form with Name, Email, Phone, Location
 */
const DetailsPaymentStep = () => {
  const { booking, setStep, updateBooking } = useBookingStore();
  const { user } = useAuthStore();

  // Check if appointment is free or paid
  const isFreeAppointment = booking.service?.price === 0;
  const price = booking.service?.price || 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: ''
    }
  });

  const onSubmit = async (data) => {
    const { answers, ...details } = data;

    const bookingPayload = {
      ...booking,
      details,
      answers,
      capacity: booking.numberOfPeople || 1
    };

    // Save form data to booking store
    updateBooking({ details, answers });

    if (isFreeAppointment) {
      // Free appointment - book directly and go to confirmation
      try {
        await createBooking(bookingPayload);
        toast.success('Appointment booked successfully!');
        setStep(5); // Go to confirmation step
      } catch (error) {
        toast.error('Failed to book appointment');
      }
    } else {
      // Paid appointment - go to payment step
      setStep(6); // Go to payment step
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta/20 rounded-full mb-4">
          <FileText className="text-terracotta" size={28} />
        </div>
        <h2 className="font-serif text-2xl text-ink">Your Details</h2>
        <p className="text-ink/60 mt-1">Please provide your contact information</p>
      </div>

      {/* Form Card */}
      <div className="card-planner p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter your name"
                className="input-planner pl-11"
              />
            </div>
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email format'
                  }
                })}
                type="email"
                placeholder="Enter your email"
                className="input-planner pl-11"
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
              <input
                {...register('phone', { required: 'Phone number is required' })}
                type="tel"
                placeholder="Enter your phone number"
                className="input-planner pl-11"
              />
            </div>
            {errors.phone && (
              <p className="text-error text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Dynamic Questions */}
          {(booking.service?.questions || []).length > 0 && (
            <div className="pt-4 border-t border-ink/10 space-y-5">
              <h3 className="font-medium text-ink/70">Additional Information</h3>
              {booking.service.questions.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-ink/70 mb-2">
                    {q.title} {q.required && <span className="text-error">*</span>}
                  </label>
                  {q.type === 'textarea' ? (
                    <textarea
                      {...register(`answers.${q.title}`, { required: q.required ? `${q.title} is required` : false })}
                      placeholder={`Enter ${q.title.toLowerCase()}`}
                      className="input-planner min-h-[100px] py-3"
                    />
                  ) : (
                    <input
                      {...register(`answers.${q.title}`, {
                        required: q.required ? `${q.title} is required` : false,
                        valueAsNumber: q.type === 'number'
                      })}
                      type={q.type}
                      placeholder={`Enter ${q.title.toLowerCase()}`}
                      className="input-planner"
                    />
                  )}
                  {errors?.answers?.[q.title] && (
                    <p className="text-error text-sm mt-1">{errors.answers[q.title].message}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Location Field */}
          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
              <input
                {...register('location')}
                placeholder="Enter your location (optional)"
                className="input-planner pl-11"
              />
            </div>
          </div>

          {/* Appointment Type Badge */}
          <div className="pt-4 border-t border-ink/10">
            {isFreeAppointment ? (
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-sage/20 rounded-planner">
                <span className="text-sage-dark font-medium">✓ Free Appointment</span>
              </div>
            ) : (
              <div className="flex items-center justify-between py-3 px-4 bg-gold/20 rounded-planner">
                <span className="text-ink/70">Total Amount</span>
                <span className="text-ink font-serif text-xl">₹{price}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              {isSubmitting ? 'Processing...' : (
                isFreeAppointment ? (
                  'Confirm Booking'
                ) : (
                  <>
                    <CreditCard size={18} />
                    Proceed to payment
                  </>
                )
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailsPaymentStep;

