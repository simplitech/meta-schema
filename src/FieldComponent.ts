import { ClassType } from './ClassType'

export interface FieldComponent<V = any> {
  is: ClassType<any>
  name?: string
  bind?: any
  on?: any
}
