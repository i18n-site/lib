#!/usr/bin/env bun
import verify from '../src/verify.js';

const test = () => {
  const positions = [
      [10, 10, 50],
      [100, 100, 50],
      [200, 50, 50],
    ],
    cases = [
      {
        name: '完全匹配中心点',
        clicks: [
          [35, 35],
          [125, 125],
          [225, 75],
        ],
        expected: true,
      },
      {
        name: '匹配边缘',
        clicks: [
          [10, 10],
          [150, 150],
          [250, 100],
        ],
        expected: true,
      },
      {
        name: '顺序错误',
        clicks: [
          [125, 125],
          [35, 35],
          [225, 75],
        ],
        expected: false,
      },
      {
        name: '坐标超出范围',
        clicks: [
          [35, 35],
          [151, 125],
          [225, 75],
        ],
        expected: false,
      },
      {
        name: '点击次数不足',
        clicks: [
          [35, 35],
          [125, 125],
        ],
        expected: false,
      },
    ];

  let passed = 0;
  cases.forEach((c) => {
    const result = verify(c.clicks, positions);
    if (result === c.expected) {
      console.log('✅ PASS: ' + c.name);
      ++passed;
    } else {
      console.error('❌ FAIL: ' + c.name + ' (expected ' + c.expected + ', got ' + result + ')');
    }
  });

  console.log('\nResult: ' + passed + '/' + cases.length + ' passed');
};

test();
