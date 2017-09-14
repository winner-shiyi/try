/**
 * 求时间差方法
 * @param {*} startTime 开始时间毫秒数
 * @param {*} endTime 结束时间毫秒数
 */
export default function difftime(startTime, endTime) {
  const diff = endTime - startTime;
  // 计算出相差天数
  const days = Math.floor(diff / (24 * 3600 * 1000));
  // 计算出小时数
  const leave1 = diff % (24 * 3600 * 1000);
  let hours = Math.floor(leave1 / (3600 * 1000));
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000);
  let minutes = Math.floor(leave2 / (60 * 1000));
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000);
  let seconds = Math.round(leave3 / 1000);

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  if (days === 0) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${days}天 ${hours}:${minutes}:${seconds}`;
}
