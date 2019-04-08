import moment from 'moment';


export const SECONDS_DAY = 86700;
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
  let height = 80;
  if (duration >= 20) {
    height = unit * duration;
  }

  return height;
};


export const checkIfTimeAvailable = (dropY, dropHeight, tasks) => {
  let available = true;
  Object.values(tasks).forEach((task) => {
    const {
      y: taskY,
      style: { height },
    } = task;

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


export const calculateStartTime = (y, scrollHeight) => {
  const unit = Math.fround(SECONDS_DAY / scrollHeight);
  const seconds = y * unit;

  const current = moment().startOf('day');
  current.add(seconds, 'S');
  let minutes = current.get('minutes');
  minutes = Math.floor(minutes / 5) * 5;
  current.set('minutes', minutes);

  const text = current.format('h:mm a');

  return text;
};
