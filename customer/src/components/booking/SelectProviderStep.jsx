import { useEffect, useState } from 'react';
import { getProviders } from '../../services/appointmentService';
import { useBookingStore } from '../../context/BookingContext';
import Button from '../common/Button';

const SelectProviderStep = () => {
  const { booking, updateBooking, setStep } =
    useBookingStore();
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getProviders(booking.service.id).then((res) =>
      setProviders(res.data)
    );
  }, []);

  return (
    <div className="space-y-4">
      <label
        className={`block border rounded-lg p-4 cursor-pointer ${
          booking.provider === 'ANY'
            ? 'border-primary'
            : ''
        }`}
      >
        <input
          type="radio"
          name="provider"
          className="hidden"
          onChange={() =>
            updateBooking({ provider: 'ANY' })
          }
        />
        Any Available Provider
      </label>

      {providers.map((provider) => (
        <label
          key={provider.id}
          className={`block border rounded-lg p-4 cursor-pointer ${
            booking.provider?.id === provider.id
              ? 'border-primary'
              : ''
          }`}
        >
          <input
            type="radio"
            name="provider"
            className="hidden"
            onChange={() =>
              updateBooking({ provider })
            }
          />
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-medium">
                {provider.name}
              </p>
              <p className="text-sm text-gray-500">
                {provider.speciality}
              </p>
            </div>
          </div>
        </label>
      ))}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          disabled={!booking.provider}
          onClick={() => setStep(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SelectProviderStep;
