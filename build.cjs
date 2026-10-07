const fs=require('node:fs'),path=require('node:path');
const out=path.join(__dirname,'dist');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','styles.css','script.js','speech.js','assets'])fs.cpSync(path.join(__dirname,file),path.join(out,file),{recursive:true});
console.log('Portfolio built in dist/');
