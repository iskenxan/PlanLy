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


export const calculateCardHeight = (duration) => {
    let height = 45;
    if (duration > 20) {
        const extra = Math.ceil((duration - 15) / 15)
        height = height + extra * 45;
    }

    return height;
}