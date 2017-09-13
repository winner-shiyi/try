export default function formatDate(value, format) {
  function fix(dTemp) {
    let d = dTemp;
    d = `${d}`;
    if (d.length <= 1) {
      d = `0${d}`;
    }
    return d;
  }
  const maps = {
    yyyy(d) { return d.getFullYear(); },
    MM(d) { return fix(d.getMonth() + 1); },
    dd(d) { return fix(d.getDate()); },
    HH(d) { return fix(d.getHours()); },
    mm(d) { return fix(d.getMinutes()); },
    ss(d) { return fix(d.getSeconds()); },
  };

  const chunk = new RegExp(Object.keys(maps).join('|'), 'g');  

  function formatDateInside(valueTemp, formatTemp) {
    let value1 = valueTemp;
    let format1 = formatTemp;
    format1 = format || 'yyyy-MM-dd HH:mm:ss';
    value1 = new Date(value1);
    return format1.replace(chunk, (capture) => (maps[capture] ? maps[capture](value1) : ''));
  }

  return formatDateInside(value, format);
}
/**
 * 使用方法
 */
// new Date('2017-08 02:14').getTime()
// formatDate(1501697640000,'yyyy-MM-dd HH:mm')
