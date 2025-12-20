import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as React from "react";
import { useBookingStore } from "../../context/BookingContext";

/**
 * @intent Calendar with time slot selection for booking appointments
 */
const SelectDateTimeStep = () => {
  const { booking, updateBooking, setStep } = useBookingStore();

  const [date, setDate] = React.useState(booking.date ? new Date(booking.date) : undefined);
  const [selectedTime, setSelectedTime] = React.useState(booking.time || null);

  // Generate time slots from 9:00 AM to 6:00 PM (15 min intervals)
  const timeSlots = React.useMemo(() => {
    return Array.from({ length: 37 }, (_, i) => {
      const totalMinutes = i * 15;
      const hour = Math.floor(totalMinutes / 60) + 9;
      const minute = totalMinutes % 60;
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    });
  }, []);

  // Example booked dates (can be replaced with real data)
  const bookedDates = React.useMemo(() => {
    const today = new Date();
    return [
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    ];
  }, []);

  const handleContinue = () => {
    if (date && selectedTime) {
      updateBooking({
        date: date.toISOString().split('T')[0],
        time: selectedTime
      });
      setStep(4);
    }
  };

  const handleBack = () => {
    setStep(2);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-0 md:pr-48">
        <div className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date || new Date()}
            disabled={(d) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return d < today || bookedDates.some(bd =>
                bd.getDate() === d.getDate() &&
                bd.getMonth() === d.getMonth() &&
                bd.getFullYear() === d.getFullYear()
              );
            }}
            showOutsideDays={false}
            className="bg-transparent p-0"
            formatters={{
              formatWeekdayName: (d) => {
                return d.toLocaleString("en-US", { weekday: "short" });
              },
            }}
          />
        </div>

        {/* Time Slots Panel */}
        <div className="inset-y-0 right-0 flex max-h-72 w-full flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
          <p className="text-sm font-medium text-muted-foreground">Select Time</p>
          <div className="grid gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => setSelectedTime(time)}
                className="w-full shadow-none"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t px-6 py-5 md:flex-row">
        <div className="text-sm flex-1">
          {date && selectedTime ? (
            <>
              Your appointment is scheduled for{" "}
              <span className="font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>{" "}
              at <span className="font-medium">{selectedTime}</span>.
            </>
          ) : (
            <>Select a date and time for your appointment.</>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={handleBack} className="flex-1 md:flex-none">
            Back
          </Button>
          <Button
            disabled={!date || !selectedTime}
            onClick={handleContinue}
            className="flex-1 md:flex-none"
          >
            Continue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectDateTimeStep;
