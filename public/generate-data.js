'use strict';
const fs = require('fs');
const dirTree = require("directory-tree");
const tree = dirTree("./work/", { extensions: /^\./ }); //ignore hidden files

let data = JSON.stringify(tree, null, 4);
fs.writeFileSync('../src/data-2.json', data);