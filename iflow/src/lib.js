import { IFlowClient, MessageType } from "@iflow-ai/iflow-cli-sdk";

export default async (chat, option) => {
  const client = new IFlowClient(option);
  try {
    await client.connect();
    const send = client.sendMessage.bind(client);
    const recv = async function* () {
      for await (const message of client.receiveMessages()) {
        if (message.type === MessageType.ASSISTANT) {
          const { text } = message.chunk;
          if (text) yield text;
        } else if (message.type === MessageType.TASK_FINISH) {
          break;
        }
      }
    };
    await chat(send, recv);
  } finally {
    await client.disconnect();
  }
};
