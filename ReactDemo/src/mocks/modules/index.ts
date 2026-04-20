import { ticketSchemas } from './ticket'
import { productSchemas } from './product'
import { inventorySchemas } from './inventory'
import { partsSchemas } from './parts'
import { serviceSchemas } from './service'
import { userSchemas } from './user'
import { configSchemas } from './config'
import type { ModuleSchema } from './types'

export * from './types'
export { ticketSchemas } from './ticket'
export { productSchemas } from './product'
export { inventorySchemas } from './inventory'
export { partsSchemas } from './parts'
export { serviceSchemas } from './service'
export { userSchemas } from './user'
export { configSchemas } from './config'

export const modulePageSchemas: ModuleSchema[] = [
  ...ticketSchemas,
  ...productSchemas,
  ...inventorySchemas,
  ...partsSchemas,
  ...serviceSchemas,
  ...userSchemas,
  ...configSchemas
]

export const moduleSchemaMap: Record<string, ModuleSchema> = Object.fromEntries(
  modulePageSchemas.map((schema) => [schema.path, schema])
)
