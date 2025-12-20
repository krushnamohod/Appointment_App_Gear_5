import { useEffect } from 'react';
import { format } from 'date-fns';
import {
  getAvailableSlots
} from '../../services/appointmentService';
import { useBookingStore } from '../../context/BookingContext';
import Button from '../common/Button';

const SelectDateTimeStep = () => {
  const {
    booking,
    updateBooking,
    setStep,
    availableSlots,
    setSlots,
    setLoadingSlots
  } = useBookingStore();

  const fetchSlots = async (date) => {
    setLoadingSlots(true);
    const res = await getAvailableSlots(
      booking.provider === 'ANY'
        ? null
        : booking.provider.id,
      date
    );
    setSlots(res.data);
    setLoadingSlots(false);
  };

  useEffect(() => {
    if (booking.date) fetchSlots(booking.date);
  }, [booking.date]);

  return (
    <div className="space-y-4">
      <input
        type="date"
        className="border p-2 rounded"
        min={format(new Date(), 'yyyy-MM-dd')}
        onChange={(e) =>
          updateBooking({ date: e.target.value })
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map((slot) => (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() =>
              updateBooking({ time: slot.time })
            }
            className={`p-2 rounded border text-sm ${
              booking.time === slot.time
                ? 'bg-primary text-white'
                : slot.available
                ? 'hover:bg-gray-100'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            {slot.time}
            {!slot.available && ' (Booked)'}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep(2)}
        >
          Back
        </Button>
        <Button
          disabled={!booking.time}
          onClick={() => setStep(4)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SelectDateTimeStep;
