// const moduleExportRegex = /module.exports.*/gi;

// const createStore = require('redux')
const r1 =
  /^(let|var|const) +([a-zA-Z_$][a-zA-Z0-9_$]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm;
// const createStore = require('redux').createStore
const r2 =
  /^(let|var|const) +([a-zA-Z_$][a-zA-Z0-9_$]*) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)\.([a-zA-Z][a-zA-Z0-9]+)/gm;
// const { createStore } = require('redux')
const r3 =
  /^(let|var|const) +(\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}) +\= +(require)\((('|")[a-zA-Z0-9-_.\/]+('|"))\)/gm;

export function replaceRequireToImport(template: string) {
  return template
    .replace(r3, `import { $3 } from $5`)
    .replace(r2, `import { $7 as $2 } from $4`)
    .replace(r1, `import $2 from $4`)
    .replace(/module.exports =/g, 'export default');
}
