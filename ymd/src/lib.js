export default (date) => {
  date = date || new Date();
  const y = date.getFullYear(),
    m = String(date.getMonth() + 1).padStart(2, "0"),
    day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
