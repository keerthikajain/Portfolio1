const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const out = path.join(root, 'dist');
fs.rmSync(out, {recursive:true, force:true});
fs.mkdirSync(out, {recursive:true});
for (const file of ['index.html', 'styles.css', 'script.js', 'scene.js', 'assets']) {
  fs.cpSync(path.join(root, file), path.join(out, file), {recursive:true});
}
console.log('Portfolio built in dist/');
