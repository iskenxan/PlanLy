export const SECONDS_DAY = 87000;
export const MINUTES_DAY = 1440;


export const getDurationText = (value) => {
  const duration = Math.floor(value);
  if (duration < 60) {
    return `${duration} mins`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr, ${minutes} mins`;
};


export const calculateCardHeight = (duration, scrollHeight) => {
  const unit = scrollHeight / MINUTES_DAY;
  let height = 65;
  if (duration > 20) {
    height = unit * duration;
  }

  return height;
};


export const checkIfTimeAvailable = (dropY, dropHeight, tasks) => {
  let available = true;
  Object.values(tasks).forEach((task) => {
    const {
      position: { y: positionY },
      style: { height },
    } = task;
    // eslint-disable-next-line no-underscore-dangle
    const taskY = positionY._value || positionY;
    const dropBottomY = dropY + dropHeight;
    if ((dropY >= taskY && dropY <= taskY + height)
      || (dropBottomY >= taskY && dropBottomY <= taskY + height)) {
      available = false;
    }
    if (dropY < taskY && dropBottomY >= taskY) {
      available = false;
    }
  });

  return available;
};
