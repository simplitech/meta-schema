import { SchemaBuilder } from './SchemaBuilder'
import { Dictionary } from './Dictionary'
import { FieldData } from './FieldData'
import { FieldSet } from './FieldSet'
import { FieldContent } from './FieldContent'
import { FieldComponent } from './FieldComponent'

export abstract class Schema {
  abstract readonly fieldSet: FieldSet<any>
  abstract translateFrom(fieldName: string): string

  get allFields(): string[] {
    return Object.keys(this.fieldSet)
  }

  get allHeaders(): string[] {
    return this.allFields.map(fieldName => this.translateFrom(fieldName))
  }

  get header(): Dictionary<string> {
    return Object.keys(this.fieldSet).reduce((result: any, key: string) => {
      result[key] = this.translateFrom(key)
      return result
    }, {})
  }

  build<M>(model: M, fieldName: string,
           attrs?: Record<string, string>, listeners?: Record<string, Function | Function[]>): SchemaBuilder<M> {
    return new SchemaBuilder(this, model, fieldName, attrs, listeners)
  }

  private fieldByType(item: any, fieldData: boolean, translateKeys: boolean) {
    return this.allFields.reduce((res: Dictionary<FieldContent>, field) => {
      const fieldContent = this.build(item, field).get()
      if (SchemaBuilder.isFieldData(fieldContent) === fieldData) {
        res[translateKeys ? this.translateFrom(field) : field] = fieldContent
      }
      return res
    }, {})
  }

  fieldData(item: any, translateKeys: boolean) {
    return this.fieldByType(item, true, translateKeys) as Dictionary<FieldData>
  }

  fieldComponent(item: any, translateKeys: boolean) {
    return this.fieldByType(item, false, translateKeys) as Dictionary<FieldComponent>
  }

  fieldDataList<M>(list: M[], translateKeys: boolean): Array<Dictionary<FieldData>> {
    return list.map(item => this.fieldData(item, translateKeys))
  }

  fieldComponentList<M>(list: M[], translateKeys: boolean): Array<Dictionary<FieldComponent>> {
    return list.map(item => this.fieldComponent(item, translateKeys))
  }
}
