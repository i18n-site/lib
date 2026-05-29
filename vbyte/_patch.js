import wasm_mod from "./__bg.wasm?url";


export const wrapArgsLi = (func)=>(...args)=>{
  var li = [];
  for(const i of args){
    if(Array.isArray(i)) {
      li = li.concat(i);
    }else{
      li.push(i);
    }
  }
  return func(li)
};

export const vbyteE = wrapArgsLi(_vbyteE);

await (async () => {
const imports = __wbg_get_imports();
__wbg_init_memory(imports);
const { instance, module } = await __wbg_load(
  await fetch(wasm_mod), imports
);
__wbg_finalize_init(instance, module);
})();
