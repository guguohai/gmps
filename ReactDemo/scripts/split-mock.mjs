import fs from 'fs'
import path from 'path'

const MOCK_DIR = path.join(process.cwd(), 'src', 'mocks')
const MODULES_DIR = path.join(MOCK_DIR, 'modules')

// 确保目录存在
if (!fs.existsSync(MODULES_DIR)) {
  fs.mkdirSync(MODULES_DIR, { recursive: true })
}

// 读取原始文件
const content = fs.readFileSync(path.join(MOCK_DIR, 'modulePageMock.ts'), 'utf8')

// 提取类型定义
const typesMatch = content.match(/export type[\s\S]*?(?=export const modulePageSchemas)/)
if (typesMatch) {
  fs.writeFileSync(path.join(MODULES_DIR, 'types.ts'), typesMatch[0])
  console.log('✓ Created: modules/types.ts')
}

// 模块映射配置
const moduleConfig = [
  { name: 'ticket', pattern: /"path":\s*"\/ticket\/[^"]+"/g, paths: ['/ticket/list', '/ticket/'] },
  { name: 'product', pattern: /"path":\s*"\/product\/[^"]+"/g, paths: ['/product/list', '/product/'] },
  { name: 'inventory', pattern: /"path":\s*"\/inventory\/[^"]+"/g, paths: ['/inventory/record', '/inventory/sync', '/inventory/transfer', '/inventory/request', '/inventory/discrepancy'] },
  { name: 'parts', pattern: /"path":\s*"\/parts\/[^"]+"/g, paths: ['/parts/list', '/parts/request'] },
  { name: 'survey', pattern: /"path":\s*"\/(survey|survey-template)\/[^"]+"/g, paths: ['/survey/', '/survey-template/'] },
  { name: 'user', pattern: /"path":\s*"\/(user|role|permission)\/[^"]+"/g, paths: ['/user/list', '/role/list', '/permission/list'] },
  { name: 'config', pattern: /"path":\s*"\/config\/[^"]+"/g, paths: ['/config/'] },
  { name: 'delivery', pattern: /"path":\s*"\/delivery\/[^"]+"/g, paths: ['/delivery/invoice'] },
]

// 简单拆分：按路径关键字分割
const sections = content.split(/(?=\{\s*\n\s*"path":)/g)

const moduleSchemas = {}
moduleConfig.forEach(cfg => {
  moduleSchemas[cfg.name] = []
})

// 分类每个 schema
sections.forEach(section => {
  const pathMatch = section.match(/"path":\s*"([^"]+)"/)
  if (!pathMatch) return
  
  const schemaPath = pathMatch[1]
  
  for (const cfg of moduleConfig) {
    if (cfg.paths.some(p => schemaPath.startsWith(p) || schemaPath.includes(p))) {
      // 提取完整的 schema 对象
      const schemaMatch = section.match(/\{\s*"path":[\s\S]*?\n  \}(?=,\n  \{|\n\])/) || 
                          section.match(/\{\s*"path":[\s\S]*?\n  \}(?=,|$)/)
      if (schemaMatch) {
        moduleSchemas[cfg.name].push(schemaMatch[0])
      }
      break
    }
  }
})

// 写入模块文件
for (const [name, schemas] of Object.entries(moduleSchemas)) {
  if (schemas.length === 0) continue
  
  const fileContent = `import type { ModuleSchema } from './types'

export const ${name}Schemas: ModuleSchema[] = [
${schemas.join(',\n')}
]
`
  fs.writeFileSync(path.join(MODULES_DIR, `${name}.ts`), fileContent)
  console.log(`✓ Created: modules/${name}.ts (${schemas.length} schemas)`)
}

// 生成聚合文件
const imports = Object.keys(moduleSchemas)
  .filter(name => moduleSchemas[name].length > 0)
  .map(name => `import { ${name}Schemas } from './${name}'`)
  .join('\n')

const exports = Object.keys(moduleSchemas)
  .filter(name => moduleSchemas[name].length > 0)
  .map(name => `  ...${name}Schemas`)
  .join(',\n')

const aggregatedContent = `${imports}
import type { ModuleSchema } from './types'

export * from './types'
${Object.keys(moduleSchemas).filter(n => moduleSchemas[n].length > 0).map(n => `export { ${n}Schemas } from './${n}'`).join('\n')}

export const modulePageSchemas: ModuleSchema[] = [
${exports}
]

export const moduleSchemaMap: Record<string, ModuleSchema> = Object.fromEntries(
  modulePageSchemas.map((schema) => [schema.path, schema])
)
`

fs.writeFileSync(path.join(MODULES_DIR, 'index.ts'), aggregatedContent)
console.log('✓ Created: modules/index.ts')

// 备份原文件并创建新的聚合文件
const backupPath = path.join(MOCK_DIR, 'modulePageMock.ts.bak')
fs.copyFileSync(path.join(MOCK_DIR, 'modulePageMock.ts'), backupPath)
console.log('✓ Backup created: modulePageMock.ts.bak')

// 创建新的 modulePageMock.ts 作为兼容层
const compatContent = `// 此文件已拆分为模块，请从 ./modules 导入
export * from './modules'
`
fs.writeFileSync(path.join(MOCK_DIR, 'modulePageMock.ts'), compatContent)
console.log('✓ Updated: modulePageMock.ts (compatibility layer)')

console.log('\n✅ Split complete!')
console.log('New structure:')
console.log('  mocks/')
console.log('    modules/')
console.log('      types.ts      - 类型定义')
console.log('      index.ts      - 聚合导出')
Object.keys(moduleSchemas).filter(n => moduleSchemas[n].length > 0).forEach(n => {
  console.log(`      ${n}.ts         - ${moduleSchemas[n].length} 个schema`)
})
console.log('    modulePageMock.ts - 兼容层')
