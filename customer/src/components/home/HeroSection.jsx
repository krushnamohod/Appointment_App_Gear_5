import Button from '../common/Button';

const HeroSection = ({ onCTAClick }) => {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-6 rounded-lg mb-10 animate-fadeIn">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Book Appointments Instantly
        </h1>
        <p className="text-lg opacity-90">
          Find trusted professionals and book your appointment
          in seconds.
        </p>
        <div className="flex justify-center">
          <div className="w-48">
            <Button variant="secondary" onClick={onCTAClick}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
