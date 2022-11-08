const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const { stdin, stdout } = process;

const folderName = 'seret-folder';
const folderPath = path.join(__dirname, 'secret-folder')

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i].toLocaleLowerCase()}`
}

fs.readdir(folderPath, null, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((file) => {
      let filePath = path.join(folderPath, file)
      let stat = fs.stat(filePath, (error, stats) => {
        if(error){
          console.log(error.message)
        } else if (stats.isFile()) {
          let dotId = file.lastIndexOf('.')
          let fileName = file.substring(0, dotId);
          let fileExt = file.substring(dotId + 1, file.length);
          console.log(`${fileName}-${fileExt}-${formatBytes(stats.size)}`)
        }
      })
    })
  }
})