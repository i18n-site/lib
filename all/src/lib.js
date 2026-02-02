export default async (promise_li) => {
  const result_li = [];
  (await Promise.allSettled(promise_li)).forEach((r) => {
    if (r.status != "fulfilled") {
      throw r.reason;
    } else {
      result_li.push(r.value);
    }
  });
  return result_li;
};
