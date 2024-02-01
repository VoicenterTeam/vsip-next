const fs = require('fs')
const path = require('path')

const rootPath = path.join(process.cwd(), '../')
const readmePath = path.join(rootPath, 'README.md')
const docsSrcDirPath = path.join(process.cwd(), 'src')
const documentationMdFilePath = path.join(docsSrcDirPath, 'documentation.md')

try {
    fs.copyFileSync(readmePath, documentationMdFilePath)
} catch(err) {
    console.error(err)
}
