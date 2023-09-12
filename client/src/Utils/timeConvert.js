const msToTimeDict = {
  Months: 2628000000,
  Days: 86400000,
  Hours: 3600000,
  Minutes: 60000,
  Seconds: 1000,
};

const msToTime = (ms) => {
  if (ms <= 0) return 'Stream is currently running! Check out the stream page!';
  const timeKeys = Object.keys(msToTimeDict);
  let totalTime = ms;
  let timeStr = '';

  for (let i = 0; i < timeKeys.length; i += 1) {
    const currentTimeNum = Math.floor(totalTime / msToTimeDict[timeKeys[i]]);
    if (currentTimeNum > 0 || timeStr) {
      timeStr += `${currentTimeNum} ${timeKeys[i]} `;
      totalTime -= currentTimeNum * msToTimeDict[timeKeys[i]];
    }
  }

  return timeStr.trim();
};

export default msToTime;
