import Button from '../common/Button';

const ServiceCard = ({ service, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-5 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {service.name}
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-primary">
            {service.category}
          </span>
        </div>

        <p className="text-sm text-gray-600">
          {service.description}
        </p>

        <div className="text-sm text-gray-700">
          <p>
            <strong>Provider:</strong>{' '}
            {service.providerName}
          </p>
          <p>
            <strong>Duration:</strong>{' '}
            {service.duration} mins
          </p>
          <p>
            <strong>Price:</strong> ₹{service.price}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button onClick={() => onBook(service)}>
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
