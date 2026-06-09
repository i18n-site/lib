const NEW_LINE = 0, IN_LINE = 1;

// Setup lookup table
const IS_WS = new Uint8Array(0x3001);
for (let i = 0; i <= 32; ++i) IS_WS[i] = 1;
IS_WS[160] = 1;
for (let i = 0x2000; i <= 0x200a; ++i) IS_WS[i] = 1;
IS_WS[0x2028] = 1;
IS_WS[0x2029] = 1;
IS_WS[0x202f] = 1;
IS_WS[0x205f] = 1;
IS_WS[0x3000] = 1;

const txtLiLookup = (txt) => {
  const r = [];
  const len = txt.length;
  let state = NEW_LINE, start = -1, end = -1;
  for (let i = 0; i < len; ++i) {
    const code = txt.charCodeAt(i);
    if (code === 10 || code === 13) {
      if (state === IN_LINE) {
        r.push(txt.slice(start, end + 1));
        state = NEW_LINE;
      }
    } else {
      const is_ws = code <= 0x3000 ? IS_WS[code] === 1 : code === 0xfeff;
      if (!is_ws) {
        if (state === NEW_LINE) {
          state = IN_LINE;
          start = i;
        }
        end = i;
      }
    }
  }
  if (state === IN_LINE) {
    r.push(txt.slice(start, end + 1));
  }
  return r;
};

// Current implementation with gated includes
const WS = [0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000];
const txtLiGated = (txt) => {
  const r = [];
  const len = txt.length;
  let state = NEW_LINE, start = -1, end = -1;
  for (let i = 0; i < len; ++i) {
    const code = txt.charCodeAt(i);
    if (code === 10 || code === 13) {
      if (state === IN_LINE) {
        r.push(txt.slice(start, end + 1));
        state = NEW_LINE;
      }
    } else {
      const is_ws = (code <= 32) || (code === 160) || (code === 0xfeff) || 
                    (code >= 0x2000 && code <= 0x3000 && WS.includes(code));
      if (!is_ws) {
        if (state === NEW_LINE) {
          state = IN_LINE;
          start = i;
        }
        end = i;
      }
    }
  }
  if (state === IN_LINE) {
    r.push(txt.slice(start, end + 1));
  }
  return r;
};

const generateTestText = () => {
  let text = '';
  for (let i = 0; i < 5000; i++) {
    text += '   Line ' + i + ' with some words   \n\n  Another line ' + i + ' \r\n';
  }
  return text;
};

const testText = generateTestText();

// Warm up
for (let i = 0; i < 10; i++) {
  txtLiLookup(testText);
  txtLiGated(testText);
}

console.time('Gated Includes');
for (let i = 0; i < 100; i++) {
  txtLiGated(testText);
}
console.timeEnd('Gated Includes');

console.time('Lookup Table (Uint8Array)');
for (let i = 0; i < 100; i++) {
  txtLiLookup(testText);
}
console.timeEnd('Lookup Table (Uint8Array)');
