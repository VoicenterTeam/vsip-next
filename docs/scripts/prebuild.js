const fs = require('fs')
const path = require('path')

const rootPath = path.join(process.cwd(), '../')
const readmePath = path.join(rootPath, 'README.md')
const docsSrcDirPath = path.join(process.cwd(), 'src')
const indexMdFilePath = path.join(docsSrcDirPath, 'index.md')

try {
    fs.copyFileSync(readmePath, indexMdFilePath)
} catch(err) {
    console.error(err)
}
