export default (client) =>
  client
    .on("error", (err) => {
      console.error("❌ redis :", err);
    })
    .connect();
