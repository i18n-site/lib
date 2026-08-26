import { describe, it, expect } from "vitest";

import minhtm from "../src/lib.js";

describe("minhtm", () => {
  it("should minify html", async () => {
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <script type="importmap">
    {
      "imports": {
        "foo": "bar"
      }
    }
    </script>
    <style>
      body {
        color: red;
      }
    </style>
  </head>
  <body>
    <!-- comments -->
    <h1> Hello   World </h1>
    <script>
      function foo() {
        console.log("bar");
      }
    </script>
  </body>
</html>
`;
    const minified = await minhtm(html);
    console.log(minified);
    expect(minified).toContain("<!doctype html>");
    expect(minified).not.toContain("<!-- comments -->");
    expect(minified).toContain("<h1>Hello World</h1>");
    expect(minified).toContain('"foo":"bar"');
  });
});
