import { default as colorer, colored } from "./index.js"

const log = (...args) => console.warn("❗", ...args)

export default process.env.NODE_ENV === "production"
	? log
	: colorer(colored("38;2;255;68;0"), log)
