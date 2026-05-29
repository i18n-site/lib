import conn from "./lib.js"

export default await conn(process.env.MYSQL)
