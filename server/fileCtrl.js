const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const j = path.join;

module.exports = class FileCtrl {
    constructor(root = '/') {
        this.root = root;
    }

    ls(path) {
        path = path || this.root;

        let currentPath = path;
        let fileList = fse.readdirSync(currentPath);
        let filesInfo = fileList.map(fileName => {
            let filePath = j(currentPath, fileName);
            let stat = fs.statSync(filePath);
            return {
                filename: fileName,
                path: filePath,
                isFile: stat.isFile(),
                isDir: stat.isDirectory(),
                birthtime: stat.birthtime,
                ctime: stat.ctime,
                size: stat.size,
            }
        })

        return filesInfo;
    }

    send(filePath) {
        let stat = fs.statSync(filePath);
        if (stat && stat.isFile()) {
            return fs.readFileSync(filePath);
        } else {
            return null;
        }
    }
}