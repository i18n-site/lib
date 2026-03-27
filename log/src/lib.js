import IS_PROD from "./IS_PROD.js";

export default IS_PROD ? () => {} : console.log;
