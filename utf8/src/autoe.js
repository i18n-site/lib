import utf8e from './utf8e.js';

export default (s) => {
  if (s.constructor === String) {
    s = utf8e(s);
  }
  return s;
};
