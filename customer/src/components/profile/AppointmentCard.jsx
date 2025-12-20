import Button from '../common/Button';

/**
 * @intent Displays a single appointment with status and action buttons
 */
const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule
}) => {
  // Handle both dateTime and separate date/time fields
  const displayDate = appointment.date || 'N/A';
  const displayTime = appointment.time || 'N/A';

  return (
    <div className="border rounded-lg p-4 bg-white space-y-2">
      <div className="flex justify-between">
        <h3 className="font-semibold">
          {appointment.service?.name || 'Unknown Service'}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'CONFIRMED'
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
        📅 {displayDate} at {displayTime}
      </p>

      <p className="text-sm">
        👤 Provider: {appointment.provider?.name || 'Any Available'}
      </p>

      {appointment.status === 'CONFIRMED' && (
        <div className="flex gap-2 mt-3">
          {onReschedule && (
            <Button
              variant="secondary"
              onClick={() => onReschedule(appointment)}
            >
              Reschedule
            </Button>
          )}
          {onCancel && (
            <Button
              variant="danger"
              onClick={() => onCancel(appointment.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
