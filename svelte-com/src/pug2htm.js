import pug from "pug"
import pugHack from "./pugHack.js"
const GET_MIXINS = () =>
	`mixin if(condition)
%_| {#if !{condition}}
%_block
%_| {/if}

mixin else
%_| {:else}
%_block

mixin elseif(condition)
%_| {:else if !{condition}}
%_block

mixin key(expression)
%_| {#key !{expression}}
%_block
%_| {/key}

mixin each(loop)
%_| {#each !{loop}}
%_block
%_| {/each}

mixin await(promise)
%_| {#await !{promise}}
%_block
%_| {/await}

mixin then(answer)
%_| {:then !{answer}}
%_block

mixin catch(error)
%_| {:catch !{error}}
%_block

mixin html(expression)
%_| {@html !{expression}}

mixin const(expression)
%_| {@const !{expression}}

mixin debug(variables)
%_| {@debug !{variables}}`.replace(/%_/g, "  ")
const transformer = (content, filename, options) => {
	const pugOptions = {
		doctype: "html",
		compileDebug: false,
		filename,
		...options,
	}
	const input = `${GET_MIXINS("space")}
${content}`
	const compiled = pug.compile(pugHack(input, filename, options), pugOptions)
	let code
	try {
		code = compiled()
	} catch (e) {
		if (e instanceof Error) {
			e.message = `[svelte-preprocess] Pug error while preprocessing ${filename}

${e.message}`
		}
		throw e
	}
	return {
		code,
		dependencies: compiled.dependencies ?? [],
	}
}

export default transformer
