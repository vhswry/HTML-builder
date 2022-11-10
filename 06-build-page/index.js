let fs = require('node:fs');
let fsp = fs.promises;
let path = require('node:path');
let readline = require('node:readline');
const { EOL } = require("os");

const projectDist = path.join(__dirname, 'project-dist');
const srcAssets = path.join(__dirname, 'assets');
const dstAssets = path.join(projectDist, 'assets');

const srcStyles = path.join(__dirname, 'styles');

fsp.mkdir(projectDist, { recursive: true });
const dstStyleStream = fs.createWriteStream(path.join(projectDist, 'style.css'));

fs.readdir(srcStyles, (err, files) => {
  if (err) {
    console.log(err.message);
    return
  }
  files = files || [];
  files.filter((file) => file.endsWith('.css')).
    forEach((file) => {
      let styleFile = path.join(srcStyles, file);
      fs.stat(styleFile, (err, stats) => {
        if (err) {
          console.log(err.message);
          return;
        }
        if (stats.isFile()) {
          fs.createReadStream(styleFile, 'utf-8').pipe(dstStyleStream);
        }
      });
    });
});

async function copyFiles(srcDir, dstDir) {
  let files = await fsp.readdir(srcDir, { withFileTypes: true });
  fsp.mkdir(dstDir, { recursive: true });

  const deleteFile = (file) => {
    fs.unlink(file, (err3) => {
      if (err3) throw err3;
      console.log(`${file} was deleted`);
    })
  };
  let destFiles = await fsp.readdir(dstDir, { withFileTypes: true });
  let srcFiles = files.map(file => file.name);
  destFiles.filter((file) => !srcFiles.includes(file.name))
    .forEach((file) => deleteFile(path.join(dstDir, file.name)));
  for await (const file of files) {
    let srcFile = path.join(srcDir, file.name);
    fs.stat(srcFile, (err, stats) => {
      if (err) {
        return;
      }
      let dstFile = path.join(dstDir, file.name);
      if (stats.isFile()) {
        fsp.copyFile(srcFile, dstFile);
      } else if (stats.isDirectory()) {
        (async () => await copyFiles(srcFile, dstFile))();
      }
    })
  }
}

copyFiles(srcAssets, dstAssets);

const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let string = '';
const componentsPath = path.join(__dirname, 'components');
const rsArticle = fs.createReadStream(path.join(componentsPath, 'articles.html'));
const rsFooter = fs.createReadStream(path.join(componentsPath, 'footer.html'));
fs.createWriteStream(path.join(projectDist, 'index.html')).write(string);
const rshead = fs.createReadStream(path.join(componentsPath, 'header.html'));
let contentheader = '';
let contentArticles = '';
let contentFooter = '';
rshead.on('data', (str) => {
  contentheader = str.toString();
  rsArticle.on('data', (str) => {
    contentArticles = str.toString();
    rsFooter.on('data', (str) => {
      contentFooter = str.toString();
      stream.on('data', (buffer) => {
        string = buffer.toString();
        string = string.replace('{{header}}', contentheader);
        string = string.replace('{{articles}}', contentArticles);
        string = string.replace('{{footer}}', contentFooter);
        fs.appendFile(path.join(projectDist, 'index.html'), `${string}${'\n'}`, () => { });
      });
    });
  });
});
