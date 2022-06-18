'use strict';
const fs = require('fs');
const dirTree = require("directory-tree");
const tree = dirTree("./work/", { extensions: /^\./ }); //ignore hidden files
const thumb = require('node-thumbnail').thumb;

thumb({
    source: './work/illustration', // could be a filename: dest/path/image.jpg
    destination: './work/illustration',
    suffix: '-thumb',
    width: 300,
}, function(files, err, stdout, stderr) {
    console.error(err);
});

let data = 'window.treeData = ';
data += JSON.stringify(tree, null, 4);
fs.writeFileSync('data.js', data);