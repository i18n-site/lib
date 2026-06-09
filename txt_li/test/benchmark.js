#!/usr/bin/env bun
import txtLi from '../src/lib.js';

const txtLiPrev = (txt) => {
  return txt.replaceAll('\r', '\n').split('\n').map((i) => {
    return i.trimEnd();
  }).filter((i) => {
    return i.length > 0;
  });
};

const generateTestText = () => {
  let text = '';
  for (let i = 0; i < 5000; ++i) {
    text += '   Line ' + i + ' with some words   \n\n  Another line ' + i + ' \r\n';
  }
  return text;
};

const test_text = generateTestText();

for (let i = 0; i < 10; ++i) {
  txtLiPrev(test_text);
  txtLi(test_text);
}

console.time('Previous (split + map + filter)');
for (let i = 0; i < 100; ++i) {
  txtLiPrev(test_text);
}
console.timeEnd('Previous (split + map + filter)');

console.time('Optimized State Machine (charCodeAt + slice)');
for (let i = 0; i < 100; ++i) {
  txtLi(test_text);
}
console.timeEnd('Optimized State Machine (charCodeAt + slice)');
