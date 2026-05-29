import { test, expect, mock } from "bun:test";

let mockReply = "";

mock.module("@opencode-ai/sdk", () => {
  return {
    createOpencode: async () => {
      return {
        client: {
          session: {
            create: async () => ({ data: { id: "test-session" } }),
            prompt: async () => ({
              data: {
                parts: [{ type: "text", text: mockReply }],
              },
            }),
          },
        },
        server: {
          close: () => {},
        },
      };
    },
  };
});

test("gci ai.js strips backticks", async () => {
  const { default: ai } = await import("../src/ai.js");

  mockReply = "```\ntype: fix\nfix bug\n```";
  expect(await ai("diff")).toBe("type: fix\nfix bug");

  mockReply = "`type: feat\nfeat: new thing`";
  expect(await ai("diff")).toBe("type: feat\nfeat: new thing");

  mockReply = "``type: docs\ndocs: readme``";
  expect(await ai("diff")).toBe("type: docs\ndocs: readme");

  mockReply = "   ```\n  type: chore\nchore: clean  \n```  ";
  expect(await ai("diff")).toBe("type: chore\nchore: clean");
});

