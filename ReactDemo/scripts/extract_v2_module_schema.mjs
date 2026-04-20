import fs from 'fs'
import path from 'path'
import { load } from 'cheerio'

const base = '/Users/guohai/Workspace/ps'
const v2 = path.join(base, 'v2')
const out = path.join(base, 'v3/src/mocks/modulePageMock.ts')

const pairs = [
  { route: '/ticket/list', title: '工单列表', breadcrumb: ['工单管理','工单列表'], list: 'ticket_list.html', detail: 'ticket_details.html' },
  { route: '/product/list', title: '产品列表', breadcrumb: ['产品管理','产品列表'], list: 'product_list.html', detail: 'product_detail.html' },
  { route: '/inventory/request', title: '申请单', breadcrumb: ['库存管理','申请单'], list: 'inventory_request_list.html', detail: 'inventory_request_detail.html' },
  { route: '/inventory/sync', title: '同步日志', breadcrumb: ['库存管理','同步日志'], list: 'inventory_sync_list.html', detail: 'inventory_sync_detail.html' },
  { route: '/inventory/record', title: '库存记录', breadcrumb: ['库存管理','库存记录'], list: 'inventory_record_list.html', detail: 'inventory_record_detail.html' },
  { route: '/parts/list', title: '小零件列表', breadcrumb: ['小零件管理','小零件列表'], list: 'parts_list.html', detail: 'parts_detail.html' },
  { route: '/parts/request', title: '申请单', breadcrumb: ['小零件管理','申请单'], list: 'parts_request_list.html', detail: 'parts_request_detail.html' },
  { route: '/service/survey', title: '问卷列表', breadcrumb: ['服务管理','问卷列表'], list: 'service_survey.html', detail: 'service_survey_detail.html' },
  { route: '/service/consultation', title: '咨询列表', breadcrumb: ['服务管理','咨询列表'], list: 'service_consultation.html', detail: 'service_consultation_detail.html' },
  { route: '/service/notice', title: '通知记录', breadcrumb: ['服务管理','通知记录'], list: 'service_notice_list.html', detail: 'service_notice_list.html' },
  { route: '/permission/user', title: '用户列表', breadcrumb: ['权限管理','用户列表'], list: 'user_list.html', detail: 'user_detail.html' },
  { route: '/permission/role', title: '角色列表', breadcrumb: ['权限管理','角色列表'], list: 'role_list.html', detail: 'role_permission_list.html' },
  { route: '/permission/list', title: '权限列表', breadcrumb: ['权限管理','权限列表'], list: 'permission_list.html', detail: 'permission_detail.html' },
  { route: '/config/dict', title: '数据字典', breadcrumb: ['系统配置','数据字典'], list: 'config_dict_list.html', detail: 'config_dict_detail.html' },
  { route: '/config/template', title: '模板配置', breadcrumb: ['系统配置','模板配置'], list: 'config_template_list.html', detail: 'config_template_detail.html' },
  { route: '/config/status', title: '状态配置', breadcrumb: ['系统配置','状态配置'], list: 'config_status_list.html', detail: 'config_status_detail.html' },
]

function clean(s='') {
  return s.replace(/\s+/g,' ').replace(/\u00a0/g,' ').trim()
}

function keyFromLabel(label, idx) {
  const k = clean(label).replace(/[\s/（）()：:\-]/g, '')
  return (k || `field${idx+1}`).toLowerCase()
}

function parseList(filename) {
  const html = fs.readFileSync(path.join(v2, filename), 'utf8')
  const $ = load(html)

  let bestTable = null
  let bestHeaders = []
  $('table').each((_, t) => {
    const hsRaw = $(t).find('thead th').map((i, th) => clean($(th).text()) || `列${i+1}`).get()
    const hs = hsRaw.filter((h) => h && !/^列\d+$/.test(h))
    if (hs.length > bestHeaders.length) {
      bestHeaders = hs
      bestTable = t
    }
  })

  if (!bestTable || bestHeaders.length === 0) {
    return { filters: [], columns: [], rows: [] }
  }

  const headerIndexes = []
  const rawHeaders = $(bestTable).find('thead th').map((i, th) => clean($(th).text()) || `列${i+1}`).get()
  rawHeaders.forEach((h, i) => {
    if (!/^列\d+$/.test(h)) headerIndexes.push(i)
  })

  const columns = bestHeaders.map((h, i) => ({ key: `c${i+1}`, title: h, width: i===0 ? 180 : 140 }))

  const rows = []
  $(bestTable).find('tbody tr').each((ridx, tr) => {
    if (ridx >= 3) return false
    const tds = $(tr).find('td')
    if (!tds.length) return
    const row = {}
    headerIndexes.forEach((tdIndex, colIndex) => {
      const td = tds.eq(tdIndex)
      row[columns[colIndex].key] = clean(td.text())
    })
    if (Object.keys(row).length) {
      row.id = Object.values(row).find((v) => String(v).trim()) || `ROW-${ridx+1}`
      rows.push(row)
    }
  })

  const labelCandidates = $('label').map((_, l)=>clean($(l).text())).get().filter(Boolean)
  const uniq = []
  for (const l of labelCandidates) {
    if (!uniq.includes(l)) uniq.push(l)
    if (uniq.length >= 4) break
  }
  const filters = uniq.map((l, i) => ({
    key: `f${i+1}`,
    label: l,
    type: i === 3 ? 'date' : (i === 1 || i === 2 ? 'select' : 'input'),
    placeholder: i === 0 ? `输入${l}` : undefined,
    options: i === 1 || i === 2 ? ['全部'] : undefined,
  }))

  return { filters, columns, rows }
}

function parseDetail(filename, fallbackColumns) {
  const full = path.join(v2, filename)
  if (!fs.existsSync(full)) {
    return [{ title:'基础信息', fields: fallbackColumns.map((c, i)=>({ key:`c${i+1}`, label:c.title, type:'input'})) }]
  }
  const html = fs.readFileSync(full, 'utf8')
  const $ = load(html)
  const sectionsMap = new Map()
  const main = $('main').first()
  const scope = main.length ? main : $('body')
  const labels = scope.find('label').toArray()

  labels.forEach((l, idx) => {
    const label = clean($(l).text())
    if (!label) return

    // 找最近分区标题，没有则统一放到基础信息
    let sectionTitle = '基础信息'
    const nearestHeading = $(l).closest('.bg-white, .rounded-xl, .shadow-sm, .border').find('h2,h3,h4').first()
    if (nearestHeading.length) {
      const t = clean(nearestHeading.text())
      if (t) sectionTitle = t
    }

    const wrap = $(l).closest('.space-y-1, .space-y-2, .field-item, div')
    let value = ''
    let detectedType = ''
    const container = wrap.length ? wrap : $(l).parent()
    const input = container.find('input').first().add($(l).nextAll('input').first()).first()
    const select = container.find('select').first().add($(l).nextAll('select').first()).first()
    const textarea = container.find('textarea').first().add($(l).nextAll('textarea').first()).first()

    if (input.length) {
      detectedType = 'input'
      value = clean(input.attr('value') || input.val() || input.attr('placeholder') || '')
      const typeAttr = clean(input.attr('type') || '')
      if (typeAttr === 'number') detectedType = 'number'
      if (typeAttr === 'date' || typeAttr === 'datetime-local') detectedType = 'date'
    } else if (select.length) {
      detectedType = 'select'
      value = clean(select.find('option[selected]').first().text() || select.find('option').first().text())
    } else if (textarea.length) {
      detectedType = 'textarea'
      value = clean(textarea.text() || textarea.attr('placeholder') || '')
    } else {
      const div = container.find('div').last()
      value = clean(div.text())
    }

    let type = detectedType || 'input'
    if (!detectedType && /状态|类型|来源|方式|分类|是否/.test(label)) type = 'select'
    if (!detectedType && /数量|库存/.test(label)) type = 'number'
    if (!detectedType && /时间|日期/.test(label)) type = 'date'
    if (!detectedType && /说明|备注|原因/.test(label)) type = 'textarea'

    const options =
      type === 'select'
        ? select.find('option').map((_, o) => clean($(o).text())).get().filter(Boolean)
        : undefined

    if (!sectionsMap.has(sectionTitle)) sectionsMap.set(sectionTitle, [])
    sectionsMap.get(sectionTitle).push({ key: keyFromLabel(label, idx), label, type, value, options })
  })

  const sections = [...sectionsMap.entries()].map(([title, fields]) => ({ title, fields }))
  if (!sections.length) {
    return [{ title:'基础信息', fields: fallbackColumns.map((c, i)=>({ key:`c${i+1}`, label:c.title, type:'input'})) }]
  }
  return sections
}

const schemas = []
for (const p of pairs) {
  const list = parseList(p.list)
  const sections = parseDetail(p.detail, list.columns)
  schemas.push({
    path: p.route,
    title: p.title,
    breadcrumb: p.breadcrumb,
    filters: list.filters,
    columns: list.columns,
    rows: list.rows,
    sections,
  })
}

const header = `export type FilterType = 'input' | 'select' | 'date'\n\nexport type ModuleFilter = {\n  key: string\n  label: string\n  type: FilterType\n  placeholder?: string\n  options?: string[]\n}\n\nexport type ModuleColumn = {\n  key: string\n  title: string\n  width?: number\n  align?: 'left' | 'center' | 'right'\n}\n\nexport type ModuleField = {\n  key: string\n  label: string\n  type?: 'input' | 'select' | 'number' | 'date' | 'textarea'\n  options?: string[]\n  value?: string\n}\n\nexport type ModuleSection = {\n  title: string\n  fields: ModuleField[]\n}\n\nexport type ModuleRow = Record<string, string | number>\n\nexport type ModuleSchema = {\n  path: string\n  title: string\n  breadcrumb: [string, string]\n  filters: ModuleFilter[]\n  columns: ModuleColumn[]\n  rows: ModuleRow[]\n  sections?: ModuleSection[]\n}\n\n`

const body = `export const modulePageSchemas: ModuleSchema[] = ${JSON.stringify(schemas, null, 2)}\n\nexport const moduleSchemaMap = Object.fromEntries(modulePageSchemas.map((item) => [item.path, item])) as Record<string, ModuleSchema>\n`

fs.writeFileSync(out, header + body)
console.log('generated', out)
