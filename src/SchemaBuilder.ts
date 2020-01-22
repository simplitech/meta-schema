import { Schema } from './Schema'
import { SchemaResult } from './SchemaResult'
import { FieldContent } from './FieldContent'
import { FieldData } from './FieldData'
import { FieldComponent } from './FieldComponent'

export class SchemaBuilder<M = any> implements SchemaResult<M> {

  static isFieldData(fieldContent: FieldContent): fieldContent is FieldData {
    return !fieldContent || typeof fieldContent === 'string' || typeof fieldContent === 'number'
  }

  constructor(schema: Schema, model: M, fieldName: string,
              attrs?: Record<string, string>, listeners?: Record<string, Function | Function[]>) {
    this.schema = schema
    this.model = model
    this.fieldName = fieldName
    this.attrs = attrs
    this.listeners = listeners
  }

  schema: Schema
  model: M
  fieldName: string
  attrs?: Record<string, string>
  listeners?: Record<string, Function | Function[]>

  get(): FieldContent {
    const { model, fieldName, attrs, listeners } = this
    return this.schema.fieldSet[this.fieldName]({ model, fieldName, attrs, listeners })
  }

  getData(): FieldData {
    const fieldContent = this.get()
    if (SchemaBuilder.isFieldData(fieldContent)) {
      return fieldContent
    }
    return null
  }

  getComponent<V>(): FieldComponent<V> | null {
    const fieldContent = this.get()
    if (typeof fieldContent === 'object') {
      return fieldContent
    }
    return null
  }
}
