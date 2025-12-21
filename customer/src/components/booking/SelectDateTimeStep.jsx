import { ChevronLeft, ChevronRight, Clock, Minus, Plus, Users, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useBookingStore } from '../../context/BookingContext';
import { getAvailableSlots } from '../../services/appointmentService';
import { subscribeToSlots, unsubscribeFromSlots, onSlotUpdate, connectSocket } from '../../services/socket';

/**
 * @intent Paper Planner styled date/time selection with 2-column layout
 * Date picker on left, Slots on right, with capacity control and intro message
 * Includes real-time slot updates via Socket.IO
 */
const SelectDateTimeStep = () => {
  const { booking, updateBooking, setStep } = useBookingStore();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [loadingValues, setLoadingValues] = useState(false);

  const manageCapacity = booking.service?.manageCapacity || false;
  const maxCapacity = booking.service?.capacity || 10;

  // Handle real-time slot update
  const handleSlotUpdate = useCallback((data) => {
    console.log('🔄 Updating slot in UI:', data);
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === data.slotId
          ? { ...slot, available: data.available, bookedCount: data.bookedCount }
          : slot
      )
    );

    // If the currently selected slot became unavailable, deselect it
    if (selectedSlotId === data.slotId && !data.available) {
      setSelectedTime(null);
      setSelectedSlotId(null);
    }
  }, [selectedSlotId]);

  // Fetch slots when date/provider/resource changes
  const fetchSlots = useCallback(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];

    if (booking.resource?.id) {
      getAvailableSlots(null, booking.resource.id, dateStr, booking.service?.id)
        .then((res) => setSlots(res.data || []));
    } else if (booking.provider?.id) {
      getAvailableSlots(booking.provider.id, null, dateStr, booking.service?.id)
        .then((res) => setSlots(res.data || []));
    } else if (booking.provider === 'ANY' || booking.resource === 'ANY') {
      getAvailableSlots(null, null, dateStr, booking.service?.id)
        .then((res) => setSlots(res.data || []))
        .catch(() => setSlots([]));
    }
  }, [booking.provider, booking.resource, booking.service?.id, selectedDate]);

  // Connect to socket and subscribe to updates
  useEffect(() => {
    const socket = connectSocket();
    setIsConnected(socket?.connected || false);

    const handleConnect = () => {
      setIsConnected(true);
      // 🔥 Re-fetch slots on reconnection to ensure we have latest data
      fetchSlots();
    };

    const handleDisconnect = () => setIsConnected(false);

    socket?.on('connect', handleConnect);
    socket?.on('disconnect', handleDisconnect);

    return () => {
      socket?.off('connect', handleConnect);
      socket?.off('disconnect', handleDisconnect);
    };
  }, [fetchSlots]);

  // Subscribe to slot updates when date changes
  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const serviceId = booking.service?.id;

    // Subscribe to slot room
    subscribeToSlots(dateStr, serviceId);

    // Register callback for slot updates
    const unregister = onSlotUpdate(handleSlotUpdate);

    return () => {
      unsubscribeFromSlots(dateStr, serviceId);
      unregister();
    };
  }, [selectedDate, booking.service?.id, handleSlotUpdate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);


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
    today.setHours(0, 0, 0, 0);
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
      setSelectedSlotId(null);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedTime(slot.time);
      setSelectedSlotId(slot.id);
    }
  };


  const handleContinue = () => {
    if (selectedTime) {
      updateBooking({
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        slotId: selectedSlotId,
        numberOfPeople: manageCapacity ? numberOfPeople : 1
      });
      setStep(4);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="card-planner p-6">
      {/* 2-Column Layout: Date Picker | Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Date Picker */}
        <div>
          <h3 className="font-serif text-lg text-terracotta mb-4">Date picker</h3>

          <div className="border border-ink/10 rounded-planner overflow-hidden bg-white">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-3 border-b border-ink/10">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="text-ink/50 hover:text-ink transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <h4 className="font-medium text-ink text-sm">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>

              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="text-ink/50 hover:text-ink transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-ink/10">
              {dayNames.map((day) => (
                <div key={day} className="py-2 text-center text-xs font-medium text-ink/50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 p-2 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={!date || isPast(date)}
                  className={`
                    h-8 w-8 mx-auto text-sm rounded
                    flex items-center justify-center
                    transition-colors
                    ${!date ? 'invisible' : ''}
                    ${date && isPast(date) ? 'text-ink/20 cursor-not-allowed' : ''}
                    ${date && !isPast(date) ? 'hover:bg-paper cursor-pointer text-ink/70' : ''}
                    ${isToday(date) && !isSelected(date) ? 'font-bold text-terracotta' : ''}
                    ${isSelected(date) ? 'bg-ink text-white' : ''}
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Time Slots */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-terracotta">Slots</h3>
            <div className={`flex items-center gap-1 text-xs ${isConnected ? 'text-sage-dark' : 'text-ink/40'}`}>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isConnected ? 'Live' : 'Offline'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {slots.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-ink/50 border border-ink/10 rounded-planner flex flex-col items-center gap-3">
                <Clock className="w-8 h-8 opacity-20" />
                <span>No slots available for this day</span>
              </div>
            ) : (
              slots.map((slot) => (
                <button
                  key={slot.id || slot.time}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                  className={`
                    py-3 px-4 text-center rounded-planner border transition-all text-sm relative
                    ${!slot.available ? 'border-ink/10 text-ink/30 cursor-not-allowed bg-ink/5' : ''}
                    ${slot.available && selectedTime !== slot.time ? 'border-terracotta/50 text-terracotta hover:border-terracotta hover:bg-terracotta/5' : ''}
                    ${selectedTime === slot.time ? 'bg-terracotta text-white border-terracotta' : ''}
                  `}
                >
                  {slot.time}
                  {slot.bookedCount !== undefined && slot.capacity && (
                    <span className="block text-[10px] opacity-70 mt-0.5">
                      {slot.capacity - slot.bookedCount} left
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Number of People - Only if manage capacity is on */}
          {manageCapacity && (
            <div className="mt-6 pt-4 border-t border-ink/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-ink/40" size={16} />
                  <span className="text-sm text-terracotta">Number of people</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    disabled={numberOfPeople <= 1}
                    className="w-8 h-8 border border-ink/20 rounded flex items-center justify-center text-ink hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="font-medium text-ink w-6 text-center">
                    {numberOfPeople}
                  </span>

                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(Math.min(maxCapacity, numberOfPeople + 1))}
                    disabled={numberOfPeople >= maxCapacity}
                    className="w-8 h-8 border border-ink/20 rounded flex items-center justify-center text-ink hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-ink/40 mt-1 text-right">
                Number of people according to capacity rules
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center py-4 border-t border-ink/10 mb-4">
        <p className="text-ink/60 italic text-sm">
          {booking.service?.introductionMessage || "Select a convenient date and time for your visit."}
        </p>
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

