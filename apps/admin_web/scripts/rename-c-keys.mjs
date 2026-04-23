import fs from 'fs'
import path from 'path'

const srcDir = 'c:\\Users\\guoha\\Workspace\\ps\\v3\\src'

function replaceInText(text, map) {
  let result = text
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    const bareKey = key.replace(/['"]/g, '')
    const newValue = map[key].replace(/['"]/g, '')
    // Match quoted keys like "c1": or 'c1':
    const quotedRegex = new RegExp(`(['"])${bareKey}\\1:`, 'g')
    result = result.replace(quotedRegex, `$1${newValue}$1:`)
    // Match unquoted keys like c1: (at start of line or after whitespace)
    const unquotedRegex = new RegExp(`(^|\\s)${bareKey}:`, 'g')
    result = result.replace(unquotedRegex, `$1${newValue}:`)
    // Match property access like .c1 or ?.c1
    const propRegex = new RegExp(`(\\?\\.|\\.)${bareKey}\\b`, 'g')
    result = result.replace(propRegex, `$1${newValue}`)
    // Match "key": "cN" patterns in schema column definitions
    const schemaKeyRegex = new RegExp(`"key":\\s*(['"])${bareKey}\\1`, 'g')
    result = result.replace(schemaKeyRegex, `"key": $1${newValue}$1`)
  }
  return result
}

function processFile(filePath, map) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath)
    return
  }
  const content = fs.readFileSync(filePath, 'utf-8')
  const newContent = replaceInText(content, map)
  fs.writeFileSync(filePath, newContent)
  console.log('Updated:', filePath)
}

function processFileByRanges(filePath, ranges) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath)
    return
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  for (const { startLine, endLine, map } of ranges) {
    const startIdx = startLine - 1
    const endIdx = endLine - 1
    const block = lines.slice(startIdx, endIdx + 1).join('\n')
    const newBlock = replaceInText(block, map)
    const blockLines = newBlock.split('\n')
    for (let i = 0; i < blockLines.length; i++) {
      lines[startIdx + i] = blockLines[i]
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\n'))
  console.log('Updated by ranges:', filePath)
}

// ========== schemas/user.ts (4 schemas, replace from back to front) ==========
processFileByRanges(path.join(srcDir, 'mocks/schemas/user.ts'), [
  // /permission/list (schema 4, lines ~99-128)
  {
    startLine: 99, endLine: 128,
    map: {
      '"c7"': '"action"',
      '"c6"': '"status"',
      '"c5"': '"visible"',
      '"c4"': '"parentPerm"',
      '"c3"': '"permType"',
      '"c2"': '"permName"',
      '"c1"': '"permCode"',
    }
  },
  // /permission/role-permission (schema 3, lines ~69-98)
  {
    startLine: 69, endLine: 98,
    map: {
      '"c7"': '"action"',
      '"c6"': '"updatedAt"',
      '"c5"': '"status"',
      '"c4"': '"permScope"',
      '"c3"': '"permCount"',
      '"c2"': '"roleName"',
      '"c1"': '"roleId"',
    }
  },
  // /permission/role (schema 2, lines ~44-68)
  {
    startLine: 44, endLine: 68,
    map: {
      '"c7"': '"action"',
      '"c6"': '"createdAt"',
      '"c5"': '"status"',
      '"c4"': '"userCount"',
      '"c3"': '"roleDesc"',
      '"c2"': '"roleName"',
      '"c1"': '"roleId"',
    }
  },
  // /permission/user (schema 1, lines ~3-43)
  {
    startLine: 3, endLine: 43,
    map: {
      '"c7"': '"action"',
      '"c6"': '"employeeNo"',
      '"c5"': '"role"',
      '"c4"': '"department"',
      '"c3"': '"position"',
      '"c2"': '"name"',
      '"c1"': '"username"',
    }
  },
])

// ========== schemas/parts.ts (2 schemas) ==========
processFileByRanges(path.join(srcDir, 'mocks/schemas/parts.ts'), [
  // /parts/request (schema 2, lines ~78-173)
  {
    startLine: 78, endLine: 173,
    map: {
      '"c11"': '"action"',
      '"c10"': '"status"',
      '"c9"': '"quantity"',
      '"c8"': '"color"',
      '"c7"': '"partLocation"',
      '"c6"': '"partName"',
      '"c5"': '"productName"',
      '"c4"': '"storeName"',
      '"c3"': '"storeType"',
      '"c2"': '"requester"',
      '"c1"': '"requestTime"',
    }
  },
  // /parts/list (schema 1, lines ~3-77)
  {
    startLine: 3, endLine: 77,
    map: {
      '"c7"': '"action"',
      '"c6"': '"location"',
      '"c5"': '"spec"',
      '"c4"': '"color"',
      '"c3"': '"quantity"',
      '"c2"': '"partName"',
      '"c1"': '"partId"',
    }
  },
])

// ========== schemas/service.ts (3 schemas) ==========
processFileByRanges(path.join(srcDir, 'mocks/schemas/service.ts'), [
  // /service/consultation (schema 3, lines ~162-259)
  {
    startLine: 162, endLine: 259,
    map: {
      '"c10"': '"action"',
      '"c9"': '"confirmResult"',
      '"c8"': '"status"',
      '"c7"': '"handler"',
      '"c6"': '"consultDate"',
      '"c5"': '"channel"',
      '"c4"': '"subject"',
      '"c3"': '"itemType"',
      '"c2"': '"itemNo"',
      '"c1"': '"ticketNo"',
    }
  },
  // /service/survey-template (schema 2, lines ~101-161)
  {
    startLine: 101, endLine: 161,
    map: {
      '"c7"': '"action"',
      '"c6"': '"updatedAt"',
      '"c5"': '"status"',
      '"c4"': '"questionCount"',
      '"c3"': '"templateDesc"',
      '"c2"': '"templateName"',
      '"c1"': '"templateNo"',
    }
  },
  // /service/survey (schema 1, lines ~3-100)
  {
    startLine: 3, endLine: 100,
    map: {
      '"c9"': '"action"',
      '"c8"': '"updatedAt"',
      '"c7"': '"submittable"',
      '"c6"': '"deadline"',
      '"c5"': '"status"',
      '"c4"': '"title"',
      '"c3"': '"template"',
      '"c2"': '"surveyNo"',
      '"c1"': '"ticketNo"',
    }
  },
])

// ========== schemas/product.ts (1 schema) ==========
processFile(path.join(srcDir, 'mocks/schemas/product.ts'), {
  '"c14"': '"stockStatus"',
  '"c13"': '"available"',
  '"c12"': '"transfer"',
  '"c11"': '"frozen"',
  '"c10"': '"localTotal"',
  '"c9"': '"inventoryDist"',
  '"c8"': '"partWarranty"',
  '"c7"': '"launchDate"',
  '"c6"': '"factory3"',
  '"c5"': '"factory2"',
  '"c4"': '"factory1"',
  '"c3"': '"category"',
  '"c2"': '"productName"',
  '"c1"': '"productId"',
})

// ========== schemas/inventory.ts (3 schemas) ==========
// Need to read file to determine exact line ranges for /inventory/record
const inventorySchemaPath = path.join(srcDir, 'mocks/schemas/inventory.ts')
const inventorySchemaContent = fs.readFileSync(inventorySchemaPath, 'utf-8')
const inventorySchemaLines = inventorySchemaContent.split('\n')
const recordSchemaStart = inventorySchemaLines.findIndex(l => l.includes('"/inventory/record"')) + 1
const syncSchemaStart = inventorySchemaLines.findIndex(l => l.includes('"/inventory/sync"')) + 1
const requestSchemaEnd = syncSchemaStart - 1
const syncSchemaEnd = recordSchemaStart - 1

processFileByRanges(inventorySchemaPath, [
  // /inventory/record (schema 3)
  {
    startLine: recordSchemaStart, endLine: inventorySchemaLines.length,
    map: {
      '"c15"': '"detail"',
      '"c14"': '"remark"',
      '"c13"': '"operatorName"',
      '"c12"': '"operateTime"',
      '"c11"': '"sourceNo"',
      '"c10"': '"sourceType"',
      '"c9"': '"afterQty"',
      '"c8"': '"beforeQty"',
      '"c7"': '"action"',
      '"c6"': '"operator"',
      '"c5"': '"recordType"',
      '"c4"': '"productName"',
      '"c3"': '"quantity"',
      '"c2"': '"recordTime"',
      '"c1"': '"recordNo"',
    }
  },
  // /inventory/sync (schema 2)
  {
    startLine: syncSchemaStart, endLine: syncSchemaEnd,
    map: {
      '"c12"': '"operation"',
      '"c11"': '"action"',
      '"c10"': '"triggerMethod"',
      '"c9"': '"diffCount"',
      '"c8"': '"failCount"',
      '"c7"': '"successCount"',
      '"c6"': '"status"',
      '"c5"': '"endTime"',
      '"c4"': '"startTime"',
      '"c3"': '"syncType"',
      '"c2"': '"syncTarget"',
      '"c1"': '"batchNo"',
    }
  },
  // /inventory/request (schema 1)
  {
    startLine: 3, endLine: requestSchemaEnd,
    map: {
      '"c11"': '"action"',
      '"c10"': '"triggerMethod"',
      '"c9"': '"processor"',
      '"c8"': '"requestQty"',
      '"c7"': '"location"',
      '"c6"': '"productName"',
      '"c5"': '"productCode"',
      '"c4"': '"requester"',
      '"c3"': '"progressStatus"',
      '"c2"': '"requestTime"',
      '"c1"': '"ticketId"',
    }
  },
])

// ========== schemas/config.ts (3 schemas) ==========
const configSchemaPath = path.join(srcDir, 'mocks/schemas/config.ts')
const configSchemaContent = fs.readFileSync(configSchemaPath, 'utf-8')
const configSchemaLines = configSchemaContent.split('\n')
const statusSchemaStart = configSchemaLines.findIndex(l => l.includes('"/config/status"')) + 1
const templateSchemaStart = configSchemaLines.findIndex(l => l.includes('"/config/template"')) + 1
const dictSchemaEnd = templateSchemaStart - 1
const templateSchemaEnd = statusSchemaStart - 1

processFileByRanges(configSchemaPath, [
  // /config/status (schema 3)
  {
    startLine: statusSchemaStart, endLine: configSchemaLines.length,
    map: {
      '"c11"': '"operation"',
      '"c10"': '"updatedBy"',
      '"c9"': '"recordStatus"',
      '"c8"': '"manualEdit"',
      '"c7"': '"action"',
      '"c6"': '"updater"',
      '"c5"': '"status"',
      '"c4"': '"description"',
      '"c3"': '"statusName"',
      '"c2"': '"statusCode"',
      '"c1"': '"bizObject"',
    }
  },
  // /config/template (schema 2)
  {
    startLine: templateSchemaStart, endLine: templateSchemaEnd,
    map: {
      '"c9"': '"action"',
      '"c8"': '"updater"',
      '"c7"': '"status"',
      '"c6"': '"language"',
      '"c5"': '"triggerNode"',
      '"c4"': '"scenario"',
      '"c3"': '"templateName"',
      '"c2"': '"code"',
      '"c1"': '"templateType"',
    }
  },
  // /config/dict (schema 1)
  {
    startLine: 3, endLine: dictSchemaEnd,
    map: {
      '"c9"': '"action"',
      '"c8"': '"updater"',
      '"c7"': '"status"',
      '"c6"': '"isDefault"',
      '"c5"': '"sortNo"',
      '"c4"': '"parentCode"',
      '"c3"': '"name"',
      '"c2"': '"code"',
      '"c1"': '"dictType"',
    }
  },
])

// ========== data/user.ts ==========
processFileByRanges(path.join(srcDir, 'mocks/data/user.ts'), [
  // PERMISSION_LIST_SECTIONS
  { startLine: 727, endLine: 811, map: { "'c7'": "'action'", "'c6'": "'status'", "'c5'": "'visible'", "'c4'": "'parentPerm'", "'c3'": "'permType'", "'c2'": "'permName'", "'c1'": "'permCode'" } },
  // PERMISSION_ROLE_PERMISSION_SECTIONS
  { startLine: 710, endLine: 726, map: { "'c7'": "'action'", "'c6'": "'updatedAt'", "'c5'": "'status'", "'c4'": "'permScope'", "'c3'": "'permCount'", "'c2'": "'roleName'", "'c1'": "'roleId'" } },
  // PERMISSION_ROLE_SECTIONS
  { startLine: 693, endLine: 709, map: { "'c7'": "'action'", "'c6'": "'createdAt'", "'c5'": "'status'", "'c4'": "'userCount'", "'c3'": "'roleDesc'", "'c2'": "'roleName'", "'c1'": "'roleId'" } },
  // PERMISSION_USER_SECTIONS
  { startLine: 667, endLine: 692, map: { "'c6'": "'employeeNo'", "'c5'": "'role'", "'c4'": "'department'", "'c3'": "'position'", "'c2'": "'name'", "'c1'": "'username'" } },
  // PERMISSION_LIST_ROWS
  { startLine: 132, endLine: 666, map: { c7: 'action', c6: 'status', c5: 'visible', c4: 'parentPerm', c3: 'permType', c2: 'permName', c1: 'permCode' } },
  // PERMISSION_ROLE_PERMISSION_ROWS
  { startLine: 99, endLine: 131, map: { c7: 'action', c6: 'updatedAt', c5: 'status', c4: 'permScope', c3: 'permCount', c2: 'roleName', c1: 'roleId' } },
  // PERMISSION_ROLE_ROWS
  { startLine: 36, endLine: 98, map: { c7: 'action', c6: 'createdAt', c5: 'status', c4: 'userCount', c3: 'roleDesc', c2: 'roleName', c1: 'roleId' } },
  // PERMISSION_USER_ROWS
  { startLine: 3, endLine: 35, map: { c7: 'action', c6: 'employeeNo', c5: 'role', c4: 'department', c3: 'position', c2: 'name', c1: 'username' } },
])

// ========== data/parts.ts ==========
processFileByRanges(path.join(srcDir, 'mocks/data/parts.ts'), [
  // PARTS_REQUEST_SECTIONS
  { startLine: 93, endLine: 191, map: { "'c11'": "'action'", "'c10'": "'status'", "'c9'": "'quantity'", "'c8'": "'color'", "'c7'": "'partLocation'", "'c6'": "'partName'", "'c5'": "'productName'", "'c4'": "'storeName'", "'c3'": "'storeType'", "'c2'": "'requester'", "'c1'": "'requestTime'" } },
  // PARTS_REQUEST_ROWS
  { startLine: 62, endLine: 92, map: { c11: 'action', c10: 'status', c9: 'quantity', c8: 'color', c7: 'partLocation', c6: 'partName', c5: 'productName', c4: 'storeName', c3: 'storeType', c2: 'requester', c1: 'requestTime' } },
  // PARTS_LIST_SECTIONS
  { startLine: 36, endLine: 61, map: { "'c7'": "'action'", "'c6'": "'location'", "'c5'": "'spec'", "'c4'": "'color'", "'c3'": "'quantity'", "'c2'": "'partName'", "'c1'": "'partId'" } },
  // PARTS_LIST_ROWS
  { startLine: 3, endLine: 35, map: { c7: 'action', c6: 'location', c5: 'spec', c4: 'color', c3: 'quantity', c2: 'partName', c1: 'partId' } },
])

// ========== data/service.ts ==========
processFileByRanges(path.join(srcDir, 'mocks/data/service.ts'), [
  // SERVICE_SURVEY_SECTIONS
  { startLine: 197, endLine: 543, map: { "'c10'": "'action'", "'c9'": "'confirmResult'", "'c8'": "'status'", "'c7'": "'handler'", "'c6'": "'consultDate'", "'c5'": "'channel'", "'c4'": "'subject'", "'c3'": "'itemType'", "'c2'": "'itemNo'", "'c1'": "'ticketNo'" } },
  // SERVICE_CONSULTATION_ROWS
  { startLine: 129, endLine: 196, map: { c10: 'action', c9: 'confirmResult', c8: 'status', c7: 'handler', c6: 'consultDate', c5: 'channel', c4: 'subject', c3: 'itemType', c2: 'itemNo', c1: 'ticketNo' } },
  // SERVICE_SURVEY_TEMPLATE_ROWS
  { startLine: 86, endLine: 128, map: { c7: 'action', c6: 'updatedAt', c5: 'status', c4: 'questionCount', c3: 'templateDesc', c2: 'templateName', c1: 'templateNo' } },
  // SERVICE_SURVEY_ROWS
  { startLine: 3, endLine: 85, map: { c9: 'action', c8: 'updatedAt', c7: 'submittable', c6: 'deadline', c5: 'status', c4: 'title', c3: 'template', c2: 'surveyNo', c1: 'ticketNo' } },
])

// ========== data/product.ts ==========
processFileByRanges(path.join(srcDir, 'mocks/data/product.ts'), [
  // PRODUCT_LIST_SECTIONS
  { startLine: 69, endLine: 90, map: { '"c14"': '"stockStatus"', '"c13"': '"available"', '"c12"': '"transfer"', '"c11"': '"frozen"', '"c10"': '"localTotal"', '"c9"': '"inventoryDist"', '"c8"': '"partWarranty"', '"c7"': '"launchDate"', '"c6"': '"factory3"', '"c5"': '"factory2"', '"c4"': '"factory1"', '"c3"': '"category"', '"c2"': '"productName"', '"c1"': '"productId"' } },
  // PRODUCT_LIST_ROWS
  { startLine: 3, endLine: 68, map: { c14: 'stockStatus', c13: 'available', c12: 'transfer', c11: 'frozen', c10: 'localTotal', c9: 'inventoryDist', c8: 'partWarranty', c7: 'launchDate', c6: 'factory3', c5: 'factory2', c4: 'factory1', c3: 'category', c2: 'productName', c1: 'productId' } },
])

// ========== data/inventory.ts ==========
const inventoryDataPath = path.join(srcDir, 'mocks/data/inventory.ts')
const inventoryDataContent = fs.readFileSync(inventoryDataPath, 'utf-8')
const inventoryDataLines = inventoryDataContent.split('\n')
const inventoryRecordSectionsStart = inventoryDataLines.findIndex(l => l.includes('INVENTORY_RECORD_SECTIONS')) + 1
const inventorySyncSectionsStart = inventoryDataLines.findIndex(l => l.includes('INVENTORY_SYNC_SECTIONS')) + 1
const inventoryRequestSectionsEnd = inventorySyncSectionsStart - 1
const inventorySyncSectionsEnd = inventoryRecordSectionsStart - 1
const inventoryRecordRowsStart = inventoryDataLines.findIndex(l => l.includes('INVENTORY_RECORD_ROWS')) + 1
const inventorySyncRowsStart = inventoryDataLines.findIndex(l => l.includes('INVENTORY_SYNC_ROWS')) + 1
const inventoryRequestRowsEnd = inventorySyncRowsStart - 1
const inventorySyncRowsEnd = inventoryRecordRowsStart - 1

processFileByRanges(inventoryDataPath, [
  // INVENTORY_RECORD_SECTIONS
  { startLine: inventoryRecordSectionsStart, endLine: inventoryDataLines.length, map: { "'c7'": "'action'", "'c6'": "'operator'", "'c5'": "'recordType'", "'c4'": "'productName'", "'c3'": "'quantity'", "'c2'": "'recordTime'", "'c1'": "'recordNo'" } },
  // INVENTORY_SYNC_SECTIONS
  { startLine: inventorySyncSectionsStart, endLine: inventorySyncSectionsEnd, map: { "'c11'": "'action'", "'c10'": "'triggerMethod'", "'c9'": "'diffCount'", "'c8'": "'failCount'", "'c7'": "'successCount'", "'c6'": "'status'", "'c5'": "'endTime'", "'c4'": "'startTime'", "'c3'": "'syncType'", "'c2'": "'syncTarget'", "'c1'": "'batchNo'" } },
  // INVENTORY_REQUEST_SECTIONS
  { startLine: 176, endLine: inventoryRequestSectionsEnd, map: { "'c11'": "'action'", "'c10'": "'triggerMethod'", "'c9'": "'processor'", "'c8'": "'requestQty'", "'c7'": "'location'", "'c6'": "'productName'", "'c5'": "'productCode'", "'c4'": "'requester'", "'c3'": "'progressStatus'", "'c2'": "'requestTime'", "'c1'": "'ticketId'" } },
  // INVENTORY_RECORD_ROWS
  { startLine: inventoryRecordRowsStart, endLine: inventorySyncSectionsStart - 1, map: { c15: 'detail', c14: 'remark', c13: 'operatorName', c12: 'operateTime', c11: 'sourceNo', c10: 'sourceType', c9: 'afterQty', c8: 'beforeQty', c7: 'action', c6: 'operator', c5: 'recordType', c4: 'productName', c3: 'quantity', c2: 'recordTime', c1: 'recordNo' } },
  // INVENTORY_SYNC_ROWS
  { startLine: inventorySyncRowsStart, endLine: inventorySyncRowsEnd, map: { c12: 'operation', c11: 'action', c10: 'triggerMethod', c9: 'diffCount', c8: 'failCount', c7: 'successCount', c6: 'status', c5: 'endTime', c4: 'startTime', c3: 'syncType', c2: 'syncTarget', c1: 'batchNo' } },
  // INVENTORY_REQUEST_ROWS
  { startLine: 3, endLine: inventoryRequestRowsEnd, map: { c11: 'action', c10: 'triggerMethod', c9: 'processor', c8: 'requestQty', c7: 'location', c6: 'productName', c5: 'productCode', c4: 'requester', c3: 'progressStatus', c2: 'requestTime', c1: 'ticketId' } },
])

// ========== data/config.ts ==========
const configDataPath = path.join(srcDir, 'mocks/data/config.ts')
const configDataContent = fs.readFileSync(configDataPath, 'utf-8')
const configDataLines = configDataContent.split('\n')
const configStatusSectionsStart = configDataLines.findIndex(l => l.includes('CONFIG_STATUS_SECTIONS')) + 1
const configTemplateSectionsStart = configDataLines.findIndex(l => l.includes('CONFIG_TEMPLATE_SECTIONS')) + 1
const configDictSectionsEnd = configTemplateSectionsStart - 1
const configTemplateSectionsEnd = configStatusSectionsStart - 1
const configStatusRowsStart = configDataLines.findIndex(l => l.includes('CONFIG_STATUS_ROWS')) + 1
const configTemplateRowsStart = configDataLines.findIndex(l => l.includes('CONFIG_TEMPLATE_ROWS')) + 1
const configDictRowsEnd = configTemplateRowsStart - 1
const configTemplateRowsEnd = configStatusRowsStart - 1

processFileByRanges(configDataPath, [
  // CONFIG_STATUS_SECTIONS
  { startLine: configStatusSectionsStart, endLine: configDataLines.length, map: { "'c7'": "'action'", "'c6'": "'updater'", "'c5'": "'status'", "'c4'": "'description'", "'c3'": "'statusName'", "'c2'": "'statusCode'", "'c1'": "'bizObject'" } },
  // CONFIG_TEMPLATE_SECTIONS
  { startLine: configTemplateSectionsStart, endLine: configTemplateSectionsEnd, map: { "'c9'": "'action'", "'c8'": "'updater'", "'c7'": "'status'", "'c6'": "'language'", "'c5'": "'triggerNode'", "'c4'": "'scenario'", "'c3'": "'templateName'", "'c2'": "'code'", "'c1'": "'templateType'" } },
  // CONFIG_DICT_SECTIONS
  { startLine: 88, endLine: configDictSectionsEnd, map: { "'c9'": "'action'", "'c8'": "'updater'", "'c7'": "'status'", "'c6'": "'isDefault'", "'c5'": "'sortNo'", "'c4'": "'parentCode'", "'c3'": "'name'", "'c2'": "'code'", "'c1'": "'dictType'" } },
  // CONFIG_STATUS_ROWS
  { startLine: configStatusRowsStart, endLine: configTemplateSectionsStart - 1, map: { c11: 'operation', c10: 'updatedBy', c9: 'recordStatus', c8: 'manualEdit', c7: 'action', c6: 'updater', c5: 'status', c4: 'description', c3: 'statusName', c2: 'statusCode', c1: 'bizObject' } },
  // CONFIG_TEMPLATE_ROWS
  { startLine: configTemplateRowsStart, endLine: configTemplateRowsEnd, map: { c9: 'action', c8: 'updater', c7: 'status', c6: 'language', c5: 'triggerNode', c4: 'scenario', c3: 'templateName', c2: 'code', c1: 'templateType' } },
  // CONFIG_DICT_ROWS
  { startLine: 3, endLine: configDictRowsEnd, map: { c9: 'action', c8: 'updater', c7: 'status', c6: 'isDefault', c5: 'sortNo', c4: 'parentCode', c3: 'name', c2: 'code', c1: 'dictType' } },
])

// ========== pages ==========
function simpleReplaceFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath)
    return
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  for (const [from, to] of replacements) {
    content = content.split(from).join(to)
  }
  fs.writeFileSync(filePath, content)
  console.log('Simple replaced:', filePath)
}

// PermissionListDetailPage: /permission/list
simpleReplaceFile(path.join(srcDir, 'pages/PermissionListDetailPage.tsx'), [
  ['currentRow?.c3', 'currentRow?.permType'],
  ['currentRow?.c2', 'currentRow?.permName'],
  ['currentRow?.c1', 'currentRow?.permCode'],
  ['row.c2', 'row.permName'],
])

// PermissionRoleDetailPage: /permission/role
simpleReplaceFile(path.join(srcDir, 'pages/PermissionRoleDetailPage.tsx'), [
  ['currentRow?.c5', 'currentRow?.status'],
  ['currentRow?.c3', 'currentRow?.roleDesc'],
  ['currentRow?.c2', 'currentRow?.roleName'],
  ['currentRow?.c1', 'currentRow?.roleId'],
  ['row.c4', 'row.parentPerm'],
  ['row.c3', 'row.permType'],
  ['row.c2', 'row.permName'],
  ['row.c1', 'row.permCode'],
])

// ProductListPage: /product/list
simpleReplaceFile(path.join(srcDir, 'pages/ProductListPage.tsx'), [
  ['row.c13', 'row.available'],
])

// TicketDetailPage2: /ticket/list
simpleReplaceFile(path.join(srcDir, 'pages/TicketDetailPage2.tsx'), [
  ['row.c1', 'row.ticketNo'],
])

// ServiceSurveyListPage: /service/survey
simpleReplaceFile(path.join(srcDir, 'pages/ServiceSurveyListPage.tsx'), [
  ['row.c6', 'row.deadline'],
  ['row.c5', 'row.status'],
  ['row.c4', 'row.title'],
  ['row.c2', 'row.surveyNo'],
  ['row.c1', 'row.ticketNo'],
])

// ConsultationDetailPage: /service/consultation
simpleReplaceFile(path.join(srcDir, 'pages/ConsultationDetailPage.tsx'), [
  ['currentRow?.c9', 'currentRow?.confirmResult'],
  ['currentRow?.c8', 'currentRow?.status'],
  ['currentRow?.c7', 'currentRow?.handler'],
  ['currentRow?.c6', 'currentRow?.consultDate'],
  ['currentRow?.c5', 'currentRow?.channel'],
  ['currentRow?.c4', 'currentRow?.subject'],
  ['currentRow?.c3', 'currentRow?.itemType'],
  ['currentRow?.c2', 'currentRow?.itemNo'],
  ['currentRow?.c1', 'currentRow?.ticketNo'],
])

// SurveyDetailPage: /service/survey
simpleReplaceFile(path.join(srcDir, 'pages/SurveyDetailPage.tsx'), [
  ['currentRow?.c8', 'currentRow?.updatedAt'],
  ['currentRow?.c7', 'currentRow?.submittable'],
  ['currentRow?.c6', 'currentRow?.deadline'],
  ['currentRow?.c5', 'currentRow?.status'],
  ['currentRow?.c4', 'currentRow?.title'],
  ['currentRow?.c3', 'currentRow?.template'],
  ['currentRow?.c2', 'currentRow?.surveyNo'],
  ['currentRow?.c1', 'currentRow?.ticketNo'],
])

console.log('Page replacements done.')
