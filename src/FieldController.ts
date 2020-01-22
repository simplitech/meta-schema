import { SchemaResult } from './SchemaResult'
import { FieldContent } from './FieldContent'

export type FieldController<M> = (schema: SchemaResult<M>) => FieldContent
