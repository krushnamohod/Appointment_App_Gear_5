import { format, differenceInMinutes } from 'date-fns';
import Button from '../common/Button';

const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule
}) => {
  const startTime = new Date(appointment.dateTime);
  const minutesLeft = differenceInMinutes(
    startTime,
    new Date()
  );

  return (
    <div className="border rounded-lg p-4 bg-white space-y-2">
      <div className="flex justify-between">
        <h3 className="font-semibold">
          {appointment.service.name}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            appointment.status === 'CONFIRMED'
              ? 'bg-success text-white'
              : appointment.status === 'CANCELLED'
              ? 'bg-error text-white'
              : 'bg-gray-300'
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        {format(startTime, 'PPP p')}
      </p>

      <p className="text-sm">
        Provider: {appointment.provider.name}
      </p>

      {minutesLeft > 0 && minutesLeft <= 60 && (
        <p className="text-sm text-primary">
          Starts in {minutesLeft} minutes
        </p>
      )}

      {appointment.status === 'CONFIRMED' && (
        <div className="flex gap-2 mt-3">
          <Button
            variant="secondary"
            onClick={() => onReschedule(appointment)}
          >
            Reschedule
          </Button>
          <Button
            variant="danger"
            onClick={() => onCancel(appointment.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
