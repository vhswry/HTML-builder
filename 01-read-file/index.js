const fs = require('node:fs');
const path = require('path')
let { stdin, stdout }  = require('node:process');

const pathToText = path.join(__dirname, 'text.txt') 

const rr = fs.createReadStream(pathToText);

fs.createReadStream(pathToText).pipe(stdout)

rr.read()

