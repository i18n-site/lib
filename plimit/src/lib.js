export default (limit) => {
  const q = [];
  let active = 0;
  const next = async () => {
    if (q.length > 0 && active < limit) {
      ++active;
      const [fn, resolve, reject] = q.shift();
      try {
        const res = await fn();
        resolve(res);
      } catch (err) {
        reject(err);
      } finally {
        --active;
        await next();
      }
    }
  };
  return (fn) =>
    new Promise((res, rej) => {
      q.push([fn, res, rej]);
      next();
    });
};
