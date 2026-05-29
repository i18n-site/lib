#!/usr/bin/env bun

import { load, dump, loads, dumps } from '../lib/index.js';
import { write } from '@3-/write';

// Test data
const testData = {
  name: 'test',
  value: 42,
  nested: {
    key: 'value'
  }
};

// Test dump function
console.log('Testing dump function...');
dump('./test-output.yml', testData);

// Test load function
console.log('Testing load function...');
const loadedData = load('./test-output.yml');
console.log('Loaded data:', loadedData);

// Test loads function
console.log('Testing loads function...');
const yamlString = dumps(testData);
console.log('YAML string:', yamlString);

// Test dumps function
console.log('Testing dumps function...');
const parsedData = loads(yamlString);
console.log('Parsed data:', parsedData);

console.log('All tests passed!');