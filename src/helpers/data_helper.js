// returns time since timestamp in human readable form
const daysAgo = (date) => {
    // Math.round((new Date().getTime() - new Date(Math.round(currentData?.timestamp_occured))) / (1000 * 3600 * 24))
    const days = Math.round((new Date().getTime() - new Date(Math.round(date))) / (1000 * 3600 * 24));
    if (days === 0) {
      // return the local time of the date
      return new Date(Math.round(date)).toLocaleTimeString();
    } else {
      return `${days} days ago`;
    }
  };

export {
    daysAgo
}