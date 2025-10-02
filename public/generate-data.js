'use strict';
const fs = require('fs');
const path = require('path');

// Absolute path to the public directory (this file's directory)
const publicDir = __dirname;
const workDirFsPath = path.join(publicDir, 'work');

// Paths used inside the JSON should be relative to public root (so index.html can load them)
const rootRelativePrefix = 'work';

// Allowed file types to include as leaf nodes
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4']);

function isHidden(name) {
    return name.startsWith('.');
}

function buildNode(fsPath, relPath) {
    const name = path.basename(fsPath);
    const stat = fs.statSync(fsPath);

    if (stat.isDirectory()) {
        const children = [];
        const entries = fs.readdirSync(fsPath, { withFileTypes: true })
            .sort((a, b) => a.name.localeCompare(b.name));

        for (const entry of entries) {
            if (isHidden(entry.name)) continue;
            const childFsPath = path.join(fsPath, entry.name);
            const childRelPath = path.posix.join(relPath, entry.name);
            const childNode = buildNode(childFsPath, childRelPath);
            if (childNode) children.push(childNode);
        }

        return { path: relPath, name, children };
    } else {
        const ext = path.extname(name).toLowerCase();
        if (!allowedExtensions.has(ext)) return null;
        return { path: relPath, name };
    }
}

// Root object mirrors current data.js structure
const tree = {
    path: './work/',
    name: 'work',
    children: []
};

if (!fs.existsSync(workDirFsPath)) {
    console.error('Work directory not found:', workDirFsPath);
    process.exit(1);
}

// Populate root children from entries in work directory
const rootEntries = fs.readdirSync(workDirFsPath, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));

for (const entry of rootEntries) {
    if (isHidden(entry.name)) continue;
    const entryFsPath = path.join(workDirFsPath, entry.name);
    const entryRelPath = path.posix.join(rootRelativePrefix, entry.name);
    const node = buildNode(entryFsPath, entryRelPath);
    if (node) tree.children.push(node);
}

const outputPath = path.join(publicDir, 'data.js');
const output = 'window.treeData = ' + JSON.stringify(tree, null, 4);
fs.writeFileSync(outputPath, output);
console.log('Generated', outputPath);