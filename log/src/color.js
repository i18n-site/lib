export const colored = (color) => {
  var prefix;
  prefix = "\x1B[" + color + "m";
  return (i) => {
    return prefix + i + "\x1B[0m";
  };
};

export default (colorer, log) => {
  return (...args) => {
    var i, li;
    li = [];
    for (i of args) {
      li.push(colorer(i));
    }
    return log(...li);
  };
};
