import { ArrowLeft, CreditCard, FileText, Mail, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../context/AuthContext';
import { useBookingStore } from '../../context/BookingContext';
import { createBooking } from '../../services/appointmentService';

/**
 * @intent Details form with Name, Email, Phone, and custom questions
 * Shows "Proceed to payment" for paid appointments, "Confirm" for free
 */
const DetailsPaymentStep = () => {
  const { booking, setStep, updateBooking } = useBookingStore();
  const { user } = useAuthStore();

  // Check if appointment is free or paid
  const isFreeAppointment = booking.service?.price === 0;
  const price = booking.service?.price || 0;

  // Mock questions from backend config (would come from service data)
  const customQuestions = booking.service?.questions || [
    { id: 'symptoms', label: 'Symptoms', type: 'textarea', required: true }
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data) => {
    // Save form data to booking
    updateBooking({ details: data });

    if (isFreeAppointment) {
      // Free appointment - book directly and go to confirmation
      await createBooking({
        ...booking,
        details: data
      });
      toast.success('Appointment booked successfully!');
      setStep(5); // Go to confirmation step
    } else {
      // Paid appointment - go to payment step
      setStep(6); // Go to payment step
    }
  };

  return (
    <div className="border-2 border-red-400 rounded-lg overflow-hidden bg-white">
      {/* Progress Bar for Paid */}
      {!isFreeAppointment && (
        <div className="h-1 bg-red-400 w-3/4"></div>
      )}

      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-red-400">
        <h2 className="text-lg font-semibold text-gray-800">Details</h2>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-red-500 mb-2">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter your name"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-300 focus:border-red-400 bg-transparent outline-none transition-colors"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-red-500 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-300 focus:border-red-400 bg-transparent outline-none transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label className="block text-sm font-medium text-red-500 mb-2">
            Phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register('phone', { required: 'Phone number is required' })}
              type="tel"
              placeholder="Enter your phone number"
              className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-300 focus:border-red-400 bg-transparent outline-none transition-colors"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Custom Questions from Backend Config */}
        {customQuestions.map((question) => (
          <div key={question.id}>
            <label className="block text-sm font-medium text-red-500 mb-2">
              {question.label}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              {question.type === 'textarea' ? (
                <textarea
                  {...register(question.id, {
                    required: question.required ? `${question.label} is required` : false
                  })}
                  placeholder={`Enter ${question.label.toLowerCase()}`}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-300 focus:border-red-400 bg-transparent outline-none transition-colors resize-none"
                />
              ) : (
                <input
                  {...register(question.id, {
                    required: question.required ? `${question.label} is required` : false
                  })}
                  type={question.type || 'text'}
                  placeholder={`Enter ${question.label.toLowerCase()}`}
                  className="w-full pl-11 pr-4 py-3 border-b-2 border-gray-300 focus:border-red-400 bg-transparent outline-none transition-colors"
                />
              )}
            </div>
            {errors[question.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id].message}</p>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-medium hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Processing...' : (
              isFreeAppointment ? (
                'Confirm'
              ) : (
                <>
                  <CreditCard size={18} />
                  Proceed to payment
                </>
              )
            )}
          </button>
        </div>

        {/* Appointment Type Badge */}
        <div className="text-center">
          {isFreeAppointment ? (
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              ✓ Free Appointment
            </span>
          ) : (
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              💳 Paid Appointment - ₹{price}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default DetailsPaymentStep;
