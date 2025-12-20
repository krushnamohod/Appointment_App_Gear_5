import { useBookingStore } from '../../context/BookingContext';
import Button from '../common/Button';

const SelectServiceStep = ({ services }) => {
  const { booking, updateBooking, setStep } =
    useBookingStore();

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <label
          key={service.id}
          className={`block border rounded-lg p-4 cursor-pointer ${
            booking.service?.id === service.id
              ? 'border-primary'
              : 'border-gray-200'
          }`}
        >
          <input
            type="radio"
            name="service"
            className="hidden"
            onChange={() => updateBooking({ service })}
          />
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600">
                {service.duration} mins · ₹{service.price}
              </p>
            </div>
          </div>
        </label>
      ))}

      <Button
        disabled={!booking.service}
        onClick={() => setStep(2)}
      >
        Continue
      </Button>
    </div>
  );
};

export default SelectServiceStep;
