/*

  patch-svelte-compiler.mjs

  replace push with reassign to fix https://github.com/sveltejs/svelte/issues/4694

  1. save this script in your project folder - note the extension mjs
  2. make sure this file exists: node_modules/svelte/compiler.js
  3. run: node patch-svelte-compiler.mjs

*/

// npm install acorn estree-walker magic-string
import {parse as acorn_parse} from "acorn";
import {walk as estree_walk} from "estree-walker";
import magicString from "magic-string";
import * as fs from "fs";

// replaceMethod
//   origin: a.push(...a1, ...a2, e, ...a3); // error: Max Stack Size Exceeded
//   spread: a = [...a1, ...a2, e, ...a3];
//   concat: a = a1.concat(a2, [e], a3);
//   performance is equal on nodejs
const replaceMethod = "spread";
//const replaceMethod = "concat";

var base_file = process.argv[2] || "node_modules/svelte/compiler";

const base_file_list = [
  `${base_file}.js`, // "type": "commonjs"
  `${base_file}.mjs`, // "type": "module"
];

for (const base_file of base_file_list) {

  const backup_file = base_file + ".bak";
  const temp_file = base_file + ".tmp";

  if (fs.existsSync(backup_file)) {
    console.log(`error: backup file exists (${backup_file}). run this script only onc`);
    continue;
  }

  if (fs.existsSync(temp_file)) {
    console.log(`error: temporary file exists (${temp_file}). run this script only onc`);
    continue;
  }

  // input
  const content = fs.readFileSync(base_file, 'utf8');

  // output
  let code = new magicString(content);

  const ast = acorn_parse(
    content, {
    ecmaVersion: 2020,
    sourceType: 'module',
  });

  const funcName = "push";

  let arrayNameList = [];

  estree_walk( ast, {
    enter: function ( node, parent, prop, index ) {

      // node must be array.push()
      if (
        node.type !== 'CallExpression' ||
        node.callee === undefined ||
        node.callee.property === undefined ||
        node.callee.property.name !== funcName
      ) { return; }

      // argument list must include spread operators
      if (node.arguments.find(
        a => (a.type == 'SpreadElement')) === undefined)
      { return; }

      const nodeSrc = content.substring(node.start, node.end);

      const pushObj = node.callee.object;
      const arrayName = content.substring(pushObj.start, pushObj.end);

      const pushProp = node.callee.property;

      arrayNameList.push(arrayName);

      // patch .push(

      if (replaceMethod == "spread") {
        // push --> assign array

        // find "(" bracket after .push
        const pushPropLen = content.substring(pushProp.start, node.end).indexOf("(");

        code.overwrite(
          (pushProp.start - 1),
          (pushProp.start + pushPropLen + 1),
          " /* PATCHED */ = [..."+arrayName+", "
        );

        // patch closing bracket
        const closeIdx = node.start + nodeSrc.lastIndexOf(")");
        code.overwrite(closeIdx, (closeIdx + 1), "]");
      }

      if (replaceMethod == "concat") {
        // push --> assign concat
        // ".push" --> " = array.concat"
        code.overwrite(
          (pushProp.start - 1),
          pushProp.end,
          " /* PATCHED */ = "+arrayName+".concat");

        // patch arguments of .concat()
        node.arguments.forEach(a => {
          if (a.type == 'SpreadElement') {
            // unspread: ...array --> array
            const spreadArgSrc = content.substring(a.argument.start, a.argument.end);
            //console.log('spread argument: '+spreadArgSrc);
            code.overwrite(a.start, a.end, spreadArgSrc);

          } else {
            // enlist: element --> [element]
            const argSrc = content.substring(a.start, a.end);
            //console.log('non spread argument: '+argSrc);
            code.overwrite(a.start, a.end, "["+argSrc+"]");
          }
        });
      }

  }});

  code = code.toString();

  function filterUnique(value, index, array) { 
    return array.indexOf(value) === index;
  }

  // replace const with let
  arrayNameList.filter(filterUnique).forEach(arrayName => {
    console.log(`arrayName = ${arrayName}`)

    code = code.replace(
      new RegExp("const "+arrayName+" = ", 'g'), // global = replace all
      "/* PATCHED const "+arrayName+" */ let "+arrayName+" = "
    );
  })

  fs.writeFileSync(temp_file, code);

  console.log(`move file: ${base_file} --> ${backup_file}`)
  fs.renameSync(base_file, backup_file);

  console.log(`move file: ${temp_file} --> ${base_file}`)
  fs.renameSync(temp_file, base_file);

}

console.log(`\n\nundo:\n`);
for (const base_file of base_file_list) {
  console.log(`mv ${base_file}.bak ${base_file}`);
}

console.log(`\n\ncompare:\n`);
for (const base_file of base_file_list) {
  console.log(`git diff ${base_file}.bak ${base_file}`);
}

console.log(`\n\ncreate patch:\n`);
console.log(`npx patch-package svelte`);
