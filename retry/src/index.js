import CallerLine from "@3-/caller_line";
import sleep from "@3-/sleep";
import ERR from "@3-/log/ERR.js";

export default (fn, max_retry = 9) => {
  const caller = CallerLine();
  return async (...args) => {
    let n = 0;
    for (;;) {
      try {
        return await fn(...args);
      } catch (err) {
        console.trace(err);
        ERR(caller + "\n" + fn + "(", ...args, ")", "\nRETRYED " + n);
        if (++n > max_retry) {
          throw err;
        }
        await sleep(999);
      }
    }
  };
};
