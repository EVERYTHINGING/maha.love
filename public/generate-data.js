'use strict';
const fs = require('fs');
const dirTree = require("directory-tree");
const tree = dirTree("./work/", { extensions: /^\./ }); //ignore hidden files

let data = 'window.treeData = ';
data += JSON.stringify(tree, null, 4);
fs.writeFileSync('data.js', data);