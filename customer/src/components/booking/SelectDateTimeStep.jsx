import { ChevronLeft, ChevronRight, Clock, Minus, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBookingStore } from '../../context/BookingContext';
import { getAvailableSlots } from '../../services/appointmentService';

/**
 * @intent Paper Planner styled date/time selection with visual calendar and booking slots
 */
const SelectDateTimeStep = () => {
  const { booking, updateBooking, setStep } = useBookingStore();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const manageCapacity = booking.service?.manageCapacity || false;
  const maxCapacity = booking.service?.maxCapacity || 10;

  useEffect(() => {
    if (booking.provider?.id) {
      getAvailableSlots(booking.provider.id, selectedDate.toISOString().split('T')[0])
        .then((res) => setSlots(res.data));
    }
  }, [booking.provider?.id, selectedDate]);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date) => {
    if (date && !isPast(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleContinue = () => {
    if (selectedTime) {
      updateBooking({
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        numberOfPeople: manageCapacity ? numberOfPeople : 1
      });
      setStep(4);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Capacity Counter - Paper Planner Style */}
      {manageCapacity && (
        <div className="card-planner p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-planner bg-sage/20 flex items-center justify-center">
                <Users className="text-sage-dark" size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink">Number of people</h3>
                <p className="text-sm text-ink/50">Max capacity: {maxCapacity}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                disabled={numberOfPeople <= 1}
                className="w-10 h-10 border border-ink/20 rounded-planner flex items-center justify-center text-ink hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={18} />
              </button>

              <span className="font-serif text-2xl text-ink w-8 text-center">
                {numberOfPeople}
              </span>

              <button
                type="button"
                onClick={() => setNumberOfPeople(Math.min(maxCapacity, numberOfPeople + 1))}
                disabled={numberOfPeople >= maxCapacity}
                className="w-10 h-10 border border-ink/20 rounded-planner flex items-center justify-center text-ink hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Calendar - Paper Planner Style */}
      <div className="card-planner overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-ink/10">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="w-10 h-10 rounded-planner border border-ink/15 flex items-center justify-center hover:bg-paper transition-colors"
          >
            <ChevronLeft size={20} className="text-ink/60" />
          </button>

          <h3 className="font-serif text-xl text-ink">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="w-10 h-10 rounded-planner border border-ink/15 flex items-center justify-center hover:bg-paper transition-colors"
          >
            <ChevronRight size={20} className="text-ink/60" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-ink/10">
          {dayNames.map((day) => (
            <div key={day} className="py-3 text-center text-sm font-medium text-ink/50 border-r border-ink/5 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Planner Lines */}
        <div className="grid grid-cols-7">
          {getDaysInMonth(currentMonth).map((date, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(date)}
              disabled={!date || isPast(date)}
              className={`
                relative h-14 border-r border-b border-ink/5 last:border-r-0
                flex items-center justify-center
                transition-colors
                ${!date ? 'bg-paper/50' : ''}
                ${date && isPast(date) ? 'text-ink/25 cursor-not-allowed' : ''}
                ${date && !isPast(date) ? 'hover:bg-paper cursor-pointer' : ''}
                ${isToday(date) ? 'bg-gold/40' : ''}
                ${isSelected(date) && !isToday(date) ? 'bg-gold/60' : ''}
              `}
            >
              {date && (
                <span className={`
                  text-sm
                  ${isToday(date) || isSelected(date) ? 'font-semibold text-ink' : 'text-ink/70'}
                `}>
                  {date.getDate()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots - Paper Planner Style */}
      <div className="card-planner p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="text-terracotta" size={20} />
          <h3 className="font-serif text-lg text-ink">Available Times</h3>
          <span className="text-sm text-ink/50">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-8 text-ink/50">
            No available slots for this date
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                disabled={!slot.available}
                className={`
                  py-3 px-4 text-center rounded-planner border-2 transition-all
                  ${!slot.available ? 'slot-booked' : ''}
                  ${slot.available && selectedTime !== slot.time ? 'slot-available' : ''}
                  ${selectedTime === slot.time ? 'slot-selected' : ''}
                `}
                style={selectedTime === slot.time ? { boxShadow: '2px 2px 0px rgba(45, 45, 45, 0.1)' } : {}}
              >
                <span className="text-sm font-medium">{slot.time}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setStep(2)}
          className="btn-secondary"
        >
          Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectDateTimeStep;
