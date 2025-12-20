export function generateSlots({ date, shifts, duration }) {
  const slots = [];

  for (const shift of shifts) {
    const [sh, sm] = shift.start.split(":").map(Number);
    const [eh, em] = shift.end.split(":").map(Number);

    let startTime = new Date(date);
    startTime.setHours(sh, sm, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(eh, em, 0, 0);

    while (startTime.getTime() + duration * 60000 <= endTime.getTime()) {
      slots.push({
        startTime: new Date(startTime),
        endTime: new Date(startTime.getTime() + duration * 60000),
      });

      startTime = new Date(startTime.getTime() + duration * 60000);
    }
  }

  return slots;
}
    