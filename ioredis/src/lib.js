import Redis from "ioredis";

export default (option) => {
  option = {
    retryStrategy: (times) => {
      if (times > 6) {
        return new Error("ioredis can't connect " + JSON.stringify(option, null, 2));
      }
      return 1e3;
    },
    enableAutoPipelining: true,
    enableOfflineQueue: true,
    keepAlive: 1e4,
    connectTimeout: 5e3,
    dropBufferSupport: true,
    maxRetriesPerRequest: 3,
    ...(option || {}),
  };

  return new Redis(option);
};
