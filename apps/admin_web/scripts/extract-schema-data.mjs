import fs from 'fs'
import path from 'path'

const SCHEMA_DIR = 'src/mocks/schemas'
const DATA_DIR = 'src/mocks/data'

function findMatchingBracket(text, startIndex) {
  let depth = 0
  let inString = false
  let escape = false
  let stringChar = null

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i]
    if (escape) {
      escape = false
      continue
    }
    if (ch === '\\') {
      escape = true
      continue
    }
    if (!inString && (ch === '"' || ch === "'" || ch === '`')) {
      inString = true
      stringChar = ch
      continue
    }
    if (inString && ch === stringChar) {
      inString = false
      stringChar = null
      continue
    }
    if (inString) continue

    if (ch === '[' || ch === '{') depth++
    if (ch === ']' || ch === '}') depth--

    if (depth === 0) return i
  }
  return -1
}

function pathToVarName(p, suffix) {
  return p.replace(/^\//, '').replace(/\//g, '_').replace(/-/g, '_').toUpperCase() + '_' + suffix
}

function extractPaths(text) {
  const paths = []
  const regex = /"path"\s*:\s*"([^"]+)"/g
  let m
  while ((m = regex.exec(text)) !== null) {
    paths.push(m[1])
  }
  return paths
}

function extractFieldRanges(text, fieldName) {
  const ranges = []
  const regex = new RegExp(`([ \t]*)(?:"${fieldName}"|${fieldName})\\s*:\\s*(\\[)`, 'g')
  let match
  while ((match = regex.exec(text)) !== null) {
    const bracketStart = match.index + match[0].length - 1
    const bracketEnd = findMatchingBracket(text, bracketStart)
    if (bracketEnd !== -1) {
      // 包含前面的空白和字段名，以及后面的逗号（如果有）
      let end = bracketEnd + 1
      // 跳过后面的空白
      while (end < text.length && /\s/.test(text[end])) end++
      // 如果后面是逗号，包含它
      if (text[end] === ',') end++
      // 向前找起始位置：包含缩进和字段名
      let start = match.index
      ranges.push({ start, end, content: text.slice(bracketStart, bracketEnd + 1) })
    }
  }
  return ranges
}

const files = fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts')
const allDataExports = [] // { file, varName, path }

for (const file of files) {
  const schemaPath = path.join(SCHEMA_DIR, file)
  const text = fs.readFileSync(schemaPath, 'utf-8')
  const paths = extractPaths(text)
  const rowsRanges = extractFieldRanges(text, 'rows')
  const sectionsRanges = extractFieldRanges(text, 'sections')

  if (rowsRanges.length === 0 && sectionsRanges.length === 0) continue

  const baseName = file.replace('.ts', '')
  const dataFileName = `${baseName}Data.ts`
  const dataFilePath = path.join(DATA_DIR, dataFileName)

  let dataFileContent = `import type { ModuleRow, ModuleSection } from '../../types/module'\n\n`

  const rangesToRemove = []

  rowsRanges.forEach((range, i) => {
    const p = paths[i] || `${baseName}_${i}`
    const varName = pathToVarName(p, 'ROWS')
    dataFileContent += `export const ${varName}: ModuleRow[] = ${range.content}\n\n`
    rangesToRemove.push(range)
    allDataExports.push({ file: dataFileName, varName, path: p, type: 'rows' })
  })

  sectionsRanges.forEach((range, i) => {
    const p = paths[i] || `${baseName}_${i}`
    const varName = pathToVarName(p, 'SECTIONS')
    dataFileContent += `export const ${varName}: ModuleSection[] = ${range.content}\n\n`
    rangesToRemove.push(range)
    allDataExports.push({ file: dataFileName, varName, path: p, type: 'sections' })
  })

  // 写入数据文件
  fs.writeFileSync(dataFilePath, dataFileContent.trimEnd() + '\n', 'utf-8')
  console.log(`Created ${dataFilePath}`)

  // 删除 schema 文件中的 rows/sections
  rangesToRemove.sort((a, b) => b.start - a.start)
  let newText = text
  for (const range of rangesToRemove) {
    // 向前吞掉空白行
    let start = range.start
    while (start > 0 && newText[start - 1] === ' ') start--
    // 如果前面是换行，继续向前吞空白
    while (start > 0 && newText[start - 1] === '\n') {
      start--
      let ws = start - 1
      while (ws >= 0 && newText[ws] === ' ') ws--
      if (ws >= 0 && newText[ws] === '\n') {
        start = ws + 1
      } else {
        start++
        break
      }
    }
    newText = newText.slice(0, start) + newText.slice(range.end)
  }

  fs.writeFileSync(schemaPath, newText, 'utf-8')
  console.log(`Updated ${schemaPath}`)
}

console.log('Skipped moduleData.ts generation (run manually to merge)')
console.log('Done!')
