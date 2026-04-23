import fs from 'fs'
import path from 'path'

const pagesDir = 'src/pages'

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let changed = false

  // Fix import { ... } from '@ant-design/icons'
  content = content.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]@ant-design\/icons['"];?/g, (match, imports) => {
    const names = imports.split(',').map(s => s.trim()).filter(Boolean)
    const used = names.filter(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g')
      const occurrences = content.match(regex)
      // Must appear more than once (the import itself counts as one)
      return occurrences && occurrences.length > 1
    })
    if (used.length === 0) return ''
    if (used.length === names.length) return match
    changed = true
    return `import { ${used.join(', ')} } from '@ant-design/icons'`
  })

  // Fix import { ... } from 'antd'
  content = content.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]antd['"];?/g, (match, imports) => {
    const names = imports.split(',').map(s => s.trim()).filter(Boolean)
    const used = names.filter(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g')
      const occurrences = content.match(regex)
      return occurrences && occurrences.length > 1
    })
    if (used.length === 0) return ''
    if (used.length === names.length) return match
    changed = true
    return `import { ${used.join(', ')} } from 'antd'`
  })

  // Fix unused destructured vars like: const { detailId } = useModuleData()
  content = content.replace(/const\s+\{\s*([^}]+)\s*\}\s*=\s*useModuleData\(\)/g, (match, vars) => {
    const names = vars.split(',').map(s => s.trim()).filter(Boolean)
    const used = names.filter(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g')
      const occurrences = content.match(regex)
      return occurrences && occurrences.length > 1
    })
    if (used.length === 0) {
      changed = true
      return 'const _unused = useModuleData()'
    }
    if (used.length === names.length) return match
    changed = true
    return `const { ${used.join(', ')} } = useModuleData()`
  })

  // Fix simple unused const like: const id = ...
  content = content.replace(/^\s*const\s+(\w+)\s*=\s*.+$/gm, (match, name) => {
    if (name === '_unused') return match
    const regex = new RegExp(`\\b${name}\\b`, 'g')
    const occurrences = content.match(regex)
    if (occurrences && occurrences.length <= 1) {
      changed = true
      return ''
    }
    return match
  })

  if (changed) {
    fs.writeFileSync(filePath, content)
    console.log('Fixed:', filePath)
  }
}

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'))
for (const file of files) {
  fixFile(path.join(pagesDir, file))
}
console.log('Done.')
