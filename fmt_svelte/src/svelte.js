var getLang;

import pug from './pug.js';

import styl from './styl.js';

getLang = (li) => {
  var i, k, v;
  for (i of li) {
    [k, v] = i.split('=');
    if (k === 'lang') {
      return v.replaceAll('"', '');
    }
  }
};

export default async(svelte) => {
  var end_tag, err, fmt, i, ref, result, setEnd, t, tag;
  result = [];
  setEnd = (tag) => {
    t = [];
    end_tag = '</' + tag + '>';
  };
  ref = svelte.split('\n');
  for (i of ref) {
    i = i.trimEnd();
    if (t) {
      if (i === end_tag) {
        t = t.join('\n');
        if (fmt) {
          try {
            t = (await fmt(t));
          } catch (error) {
            err = error;
            throw new Error(t + '\n' + tag + ': ' + err);
          }
        }
        result.push(t.trim());
        result.push(i);
        t = fmt = void 0;
      } else {
        t.push(i);
      }
    } else {
      result.push(i);
      if (i.startsWith('<') && i.endsWith('>')) {
        i = i.slice(1, -1).split(' ');
        tag = i.shift().trim();
        switch (tag) {
          case 'template':
            if (getLang(i) === 'pug') {
              fmt = pug;
            }
            break;
          case 'style':
            if (getLang(i) === 'stylus') {
              fmt = styl;
            }
        }
        setEnd(tag);
      }
    }
  }
  if (t != null ? t.length : void 0) {
    result = result.concat(t);
  }
  // return
  return result.join('\n').trim();
};
