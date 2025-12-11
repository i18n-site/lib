import Redis from "ioredis";

export default (url, option) => {
  if (url.constructor != String) {
    option = url;
    url = undefined;
  } else {
    option = option || {};
  }

  option.retryStrategy = (times) => {
    if (times > 6) {
      throw new Error(
        "ioredis can't connect " + url ? url : JSON.stringify(option),
      );
    }
    return 1e3;
  };

  if (url) {
    return new Redis(url, option);
  }

  return new Redis(option);
};
