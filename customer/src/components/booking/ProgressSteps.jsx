const steps = ['Service', 'Provider', 'Date & Time', 'Details'];

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, index) => {
        const step = index + 1;
        const completed = step < currentStep;

        return (
          <div key={label} className="flex-1 flex items-center">
            <div
              className={`h-8 w-8 flex items-center justify-center rounded-full font-medium ${
                completed
                  ? 'bg-success text-white'
                  : step === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {completed ? '✓' : step}
            </div>
            <span className="ml-2 text-sm hidden md:block">
              {label}
            </span>
            {step < steps.length && (
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div
                  className={`h-full ${
                    completed ? 'bg-success' : ''
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
