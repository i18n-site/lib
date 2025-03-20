export default (css)=> if css.includes("'") then JSON.stringify(css) else "'"+css.replaceAll('\r','').replaceAll('\n','\\n')+"'"
