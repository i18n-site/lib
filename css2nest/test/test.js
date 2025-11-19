#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict
var except, from_css;

import css2nest from '../src/lib.js';

import {
  equal
} from 'assert/strict';

from_css = `.form-group>input,
.form-group>textarea {
  width: 100%;
  padding: 8px;
}

.button-group .btn,
.button-group .btn-primary {
  padding: 10px 20px;
  border-radius: 4px;
}

.button-group .btn-primary {
  color: white;
}

.button-group .btn-primary:hover {
  background: #0056b3;
}

.button-group .btn-primary {
  font-size: 12px;
}

@media (max-width: 768px) {
  .h2 .nav {
    flex-direction: column;
    color: red;
  }

  .h2 .good {
    flex-direction: column;
    color: red;
  }

  .h2 {
    color: #000;
  }
}`;

except = `.form-group {
  &>input, &>textarea {
    width: 100%;
    padding: 8px;
  }
}

.button-group {
  .btn, .btn-primary {
    padding: 10px 20px;
    border-radius: 4px;
  }
  .btn-primary {
    color: white;
    &:hover {
      background: #0056b3;
    }
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .h2 {
    .nav, .good {
      flex-direction: column;
      color: red;
    }
    color: #000;
  }
}`;


const out = css2nest(from_css);
// equal(css2nest(from_css), except);
