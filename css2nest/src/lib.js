import { parse, walk } from 'css-tree'

const main = (css) => {
  const ast = parse(css), out = [];

  walk(ast, {
    visit: 'Rule',
    enter: (node) => {
      // console.log(JSON.stringify(node.prelude.children,null,2)); 
      // console.log(node.block); 
    }
  });


  return out.join('\n\n');
}

export default main

