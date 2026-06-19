/*
USAGE:

node merge.js /path/to/src

EXAMPLE:
node merge.js /home/stefan/projects/pocketbase-nextjs-auth/src

OUTPUT:
- creates merged_files.txt in current working directory
- contains all files from given folder + subfolders
*/

const fs = require('fs')
const path = require('path')

const root = process.argv[2]

if (!root) {
    console.error('Usage: node merge.js <path-to-src>')
    process.exit(1)
}

const outputFile = path.join(process.cwd(), 'merged_files.txt')

function walk(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const e of entries) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) walk(full, files)
        else files.push(full)
    }

    return files
}

if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
}

const files = walk(root)

let buffer = ''

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    buffer += `\n\n===== FILE: ${file} =====\n\n`
    buffer += content
}

fs.writeFileSync(outputFile, buffer, 'utf8')

console.log(`merged ${files.length} files into ${outputFile}`)