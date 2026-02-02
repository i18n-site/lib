import { default as colorer, colored } from "./index.js"

const log = (...args) => console.error("❌", ...args)

export default process.env.NODE_ENV === "production"
	? log
	: colorer(colored("0;31;1"), log)
