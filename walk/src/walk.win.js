export default (walk_raw) =>
  function* (...args) {
    for (const item of walk_raw(...args)) {
      yield item.replaceAll("\\", "/");
    }
  };
