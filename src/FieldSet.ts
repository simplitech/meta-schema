import { FieldController } from './FieldController'

export interface FieldSet<M> {
  [fieldName: string]: FieldController<M>
}
