export function convertHourStringToMinutes(hourString: string): number {
  const [hours, seconds] = hourString.split(':').map(Number);

  return (hours * 60) + seconds;
}