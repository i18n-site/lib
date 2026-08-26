#!/usr/bin/env -S bun test
import { test, expect } from "bun:test";
import css2nest from "../src/lib.js";

test("css2nest translation", () => {
  const from_css = `.form-group>input,
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
  &:hover{
    color:#f40;
  }
  &>a{
    color:#f00;
  }
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

  const except = `.form-group>input, .form-group>textarea {
  width: 100%;
  padding: 8px;
}

.button-group {
  .btn, .btn-primary {
    padding: 10px 20px;
    border-radius: 4px;
  }
  .btn-primary {
    color: white;
    &:hover{color:#f40}
    &>a{color:#f00}
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

  expect(css2nest(from_css)).toBe(except);
});

test("top-level pseudo selectors", () => {
  const from_css = `:host > v-scroll {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
:host > v-scroll > b {
  display: block;
}
:root {
  --color: red;
}
:root .card {
  color: blue;
}
:root .card:hover {
  color: green;
}`;

  const except = `:host>v-scroll {
  display: flex;
  flex-direction: column;
  min-height: 0;
  &>b {
    display: block;
  }
}

:root {
  --color:  red;
  .card {
    color: blue;
    &:hover {
      color: green;
    }
  }
}`;

  expect(css2nest(from_css)).toBe(except);
});

test("nested classes", () => {
  const css3 = ".toast { color: grey; } .toast.ERR { color: red; }";
  const expect3 = ".toast {\n  color: grey;\n  &.ERR {\n    color: red;\n  }\n}";
  expect(css2nest(css3)).toBe(expect3);

  const css4 = ".animated { color: blue; } .animated.fadeInLeft { color: red; }";
  const expect4 = ".animated {\n  color: blue;\n  &.fadeInLeft {\n    color: red;\n  }\n}";
  expect(css2nest(css4)).toBe(expect4);
});

test("auto flatten empty parent", () => {
  const css5 = ".a.b, .a.c { color: red; }";
  const expect5 = ".a.b, .a.c {\n  color: red;\n}";
  expect(css2nest(css5)).toBe(expect5);
});

test("blockless at-rules", () => {
  const css6 =
    '@import url("//registry.npmmirror.com/18s/0.2.16/files/_.css");\n@charset "UTF-8";\nbody {\n  color: red;\n}';
  const expect6 =
    '@import url(//registry.npmmirror.com/18s/0.2.16/files/_.css);\n\n@charset "UTF-8";\n\nbody {\n  color: red;\n}';
  expect(css2nest(css6)).toBe(expect6);
});

test("nested rules without trailing semicolon", () => {
  const css7 =
    ".demo {\n  display: flex;\n  article.Lg {\n    border-radius: 24px;\n    h3 {\n      color: red;\n    }\n  }\n}";
  const expect7 =
    ".demo {\n  display: flex;\n  article.Lg {\n    border-radius: 24px;\n    h3 {\n      color: red;\n    }\n  }\n}";
  expect(css2nest(css7)).toBe(expect7);
});

test("preserve css comments", () => {
  const css8 =
    "/* top comment */\n.demo {\n  /* inside comment */\n  display: flex;\n  /* trailing comment */\n}";
  const expect8 =
    "/* top comment */\n\n.demo {\n  /* inside comment */\n  display: flex;\n  /* trailing comment */\n}";
  expect(css2nest(css8)).toBe(expect8);
});

test("preserve nested css comments", () => {
  const css9 =
    "/* top-level */\n.outer {\n  /* outer start */\n  color: blue;\n  .inner {\n    /* inner start */\n    color: red;\n    /* inner end */\n  }\n  /* outer end */\n}";
  const expect9 =
    "/* top-level */\n\n.outer {\n  /* outer start */\n  color: blue;\n  .inner {\n    /* inner start */\n    color: red;\n    /* inner end */\n  }\n  /* outer end */\n}";
  expect(css2nest(css9)).toBe(expect9);
});
