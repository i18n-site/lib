import { createSentinel } from "redis";
import wrap from "./wrap.js";

export default (conf) => {
  return wrap(createSentinel(conf));
};
