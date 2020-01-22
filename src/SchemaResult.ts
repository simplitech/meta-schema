export interface SchemaResult<M> {
  model: M
  fieldName: string
  attrs?: Record<string, string>
  listeners?: Record<string, Function | Function[]>
}
