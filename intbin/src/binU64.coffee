export default (bin) =>
  bin.readUIntLE(0, bin.byteLength)
