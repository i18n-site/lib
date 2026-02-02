const pad = (n) => String(n).padStart(2, "0");

export default (d) => {
  d = d || new Date();
  const Y = d.getFullYear(),
    M = pad(d.getMonth() + 1),
    D = pad(d.getDate()),
    h = pad(d.getHours()),
    m = pad(d.getMinutes());

  return `${Y}-${M}-${D} ${h}:${m}`;
};
