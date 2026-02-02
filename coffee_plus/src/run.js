import debounce from "@3-/debounce"
import { spawn } from "child_process"
import fs from "fs"
import path from "path"

export default (sh) => {
	let child

	const kill = () => {
		if (child) {
			child.kill("SIGKILL")
		}
	}

  const file_li = [],
    fileSet = ()=>new Set(file_li.splice(0, file_li.length)),
    start = (file) => {
		if (child) {
			kill()
		}
		const buffer = fs.readFileSync(sh, {
			encoding: "utf8",
			flag: "r",
			length: 2048,
		})
		const data = buffer.toString()
		const firstLine = data.split(/\n/)[0]
		let shebangLine = firstLine
		shebangLine = shebangLine.trimStart()
    const option = { stdio: "inherit" }

		if (shebangLine.startsWith("#!")) {
			const shebang = shebangLine.slice(2).trim()
			const parts = shebang.split(/ +/)
			const interpreter = parts[0]
			const args = parts.slice(1)
			child = spawn(
        interpreter, [
          ...args,
          sh, 
          ...fileSet()
        ], 
        option
      )
		} else {
			child = spawn(
        process.execPath, [
          sh,
          ...fileSet()
        ], 
        option
      )
		}
		child.on("exit", (code) => {
      if(code){
        console.log(`EXIT WITH CODE: ${code}`)
      }
		})
	}

  const restart = debounce(1000, () => {
    kill()
    start()
  })

	start() // 启动初始进程
	return [
    (file)=>{
      file_li.push(file)
      restart()
    },
		kill,
	]
}
