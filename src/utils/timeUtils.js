const checkOverlap = (range1, range2) => {
  const startTime1 = new Date(`1970-01-01T${range1.startTime}`).getTime();
  const endTime1 = new Date(`1970-01-01T${range1.endTime}`).getTime();
  const startTime2 = new Date(`1970-01-01T${range2.startTime}`).getTime();
  const endTime2 = new Date(`1970-01-01T${range2.endTime}`).getTime();

  return (
    (startTime1 >= startTime2 && startTime1 < endTime2) ||
    (endTime1 > startTime2 && endTime1 <= endTime2) ||
    (startTime2 >= startTime1 && startTime2 < endTime1) ||
    (endTime2 > startTime1 && endTime2 <= endTime1)
  );
};

const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

module.exports = { checkOverlap, formatTime };
