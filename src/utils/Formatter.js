export const SECONDS_DAY = 87000;
export const MINUTES_DAY = 1440;


export const getDurationText = (duration) => {
    duration = Math.floor(duration);

    if (duration < 60) {
        return `${duration} mins`
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr, ${minutes} mins`;
}


export const calculateCardHeight = (duration, scrollHeight) => {
    const unit = scrollHeight / MINUTES_DAY;
    let height = 65;
    if (duration > 20) {
        height = unit * duration;
    }

    return height;
}