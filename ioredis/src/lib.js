import Redis from "ioredis";

export default (option) => {
  option = {
    retryStrategy: (times) => {
      if (times > 6) {
        throw new Error("ioredis can't connect " + url ? url : JSON.stringify(option));
      }
      return 1e3;
    },
    enableAutoPipelining: true,
    ...(option || {}),
  };

  return new Redis(option);
};
