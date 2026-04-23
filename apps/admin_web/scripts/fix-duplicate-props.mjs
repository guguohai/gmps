import fs from 'fs'

const path = 'src/mocks/data/user.ts'
let content = fs.readFileSync(path, 'utf-8')

// 删除 sortNo 行后面紧跟的重复 visible 和 status 行
content = content.replace(/(sortNo: '[^']+',\r?\n)(\s+visible: '[^']+',\r?\n)(\s+status: '[^']+',\r?\n)/g, '$1')

fs.writeFileSync(path, content)
console.log('Duplicate props removed.')
