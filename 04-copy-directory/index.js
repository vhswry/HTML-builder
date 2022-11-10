const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");

const deleteFile = (file) => {
  fs.unlink(file, (err3) => {
    if (err3) throw err3;
    console.log(`${file} was deleted`);
  })
}
function copyFiles(src, dest) {
  fs.access(dest, undefined, err => {
    if (err) fs.mkdir(dest, () => { })
  })
  fs.readdir(src, null, function (err, srcFiles) {
    if (err) {
      console.log(err.message);
    } else {
      fs.readdir(dest, null, function (err2, destFiles) {
        if (err2) {
          console.log(err2.message);
        }
        // deleting files that are not relevant
        destFiles.filter((file) => !srcFiles.includes(file))
          .forEach((file) => deleteFile(path.join(dest, file)));
        // copy actial files 
        srcFiles.forEach((file) => {
          let srcFile = path.join(src, file);
          let dstFile = path.join(dest, file);
          fs.access(dstFile, (accesErr) => {
            if (accesErr) {
              // copy file if not exist
              fs.readFile(srcFile, (err, data) => {
                if (err) {
                  console.log(err.message)
                } else {
                  fs.writeFile(dstFile, data, '', (err) => { if (err) { console.log(err.message) } })
                }
              })
            } else {
              // copy file that are relevant
              fs.readFile(srcFile, (err, data1) => {
                if (err) throw err;
                fs.readFile(dstFile, (err, data2) => {
                  if (err) throw err;
                  if (data1.equals(data2)) {
                  } else {
                    fs.writeFile(dstFile, data1, '', (err) => { if (err) { console.log(err.message) } })
                  }
                });
              });
            }
          })
        })
      });
    }
  })
}

const fromFolder = path.join(__dirname, "files");
const toFolder = path.join(__dirname, "files-copy");
copyFiles(fromFolder, toFolder)



