const fs = require('node:fs');
const path = require('path')
const process = require('node:process');
const { stdin, stdout } = process;

const fileName = 'output.txt';
const outputTxt = path.join(__dirname, fileName)

let outputStream = fs.createWriteStream(outputTxt, 'utf-8')

stdout.write(`Welcome! You can write some text and it will be in ${fileName} file.\n`)

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  outputStream.write(data);
});

['SIGINT', 'SIGTERM', 'SIGQUIT']
  .forEach(signal => process.on(signal, () => {
    process.exit();
  }));

process.on('exit', () => stdout.write('Goodbye!\n'));
