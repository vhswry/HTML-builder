let fs = require('node:fs')
let path = require('node:path')

let stylesDir = path.join(__dirname, 'styles')
let writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(stylesDir, null, (err, files) => {
  if (err) {
    console.log(err.message);
    return;
  }
  files = files || [];
  files.filter((style) => style.endsWith('.css'))
  .forEach((file) => {
      let styleFile = path.join(stylesDir, file);
      fs.stat(styleFile, (err, stats) => {
        if (stats.isFile()) {
          let readStream = fs.createReadStream(styleFile, 'utf-8');
          readStream.pipe(writeStream);
        }
      })
    });
})