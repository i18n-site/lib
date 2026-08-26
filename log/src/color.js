export const IS_TTY = typeof process !== "undefined" && process.stdout?.isTTY,
  colored = (color) => (IS_TTY ? (i) => "\x1B[" + color + "m" + i + "\x1B[0m" : (i) => i);

export default (colorer, log) =>
  (...args) =>
    log(...args.map(colorer));
