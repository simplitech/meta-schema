# Meta-Schema

A data-structure library to describe more information about your model in a separated file

## Install
```
npm i @simpli/meta-schema
```

## About
Meta-Schema helps you to organize meta information about the Model fields, can be used to declare how the field will be rendered.

## Usage

### Import
```typescript
import { Schema, FieldSet, FieldComponent } from '@simpli/meta-schema'
```

### Create your schema
```typescript
class MyModel {
  title: string | null = null
  description: string | null = null
}

class MySchema extends Schema {
  // create a function to translate your field names, 
  // my translation only put it on uppercase
  translateFrom = (fieldName: string) => fieldName.toUpperCase()

  // declare the fieldSet
  readonly fieldSet: FieldSet<MyModel> = {
    // our first field is 'title', is a FieldComponent
    title: (schema): FieldComponent => ({
      // on "is" you may put the component class to render the fieldset
      is: MyComponent,
      // on "bind" you can put any prop
      bind: {
        label: this.translateFrom(schema.fieldName),
        required: true,
        validation: 'required',
      },
      // you can declare a `name` and use `on` for listeners
    }),
    // our second field is 'description', is a FieldData because it only answer a primitive value
    description: schema => schema.model.description,
  }
}
```
### Schema basic methods
```typescript
const subject = new MySchema()

subject.allFields // returns ['title', 'description']
subject.allHeaders // returns ['TITLE', 'DESCRIPTION']
subject.header // returns {title: 'TITLE', description: 'DESCRIPTION'}

const model = new MyModel()
model.title = 'my title'
model.description = 'my description'

const schemaBuilder = subject.build(model, 'title')
schemaBuilder.schema // returns subject
schemaBuilder.model // returns model
schemaBuilder.fieldName // returns 'title'

const m1 = new MyModel()
m1.title = 'my title'
m1.description = 'my description'
const m2 = new MyModel()
m2.title = 'other title'
m2.description = 'other description'
const m3 = new MyModel()
m3.title = 'with null description'
m3.description = null

subject.fieldDataList([m1, m2, m3], false) // false to use the fieldname as key
/* returns 
[
  {"description": "my description"},
  {"description": "other description"},
  {"description": null}
]
*/

subject.fieldDataList([m1, m2, m3], true) // true to use the translation as key
/* returns 
[
  {"DESCRIPTION": "my description"},
  {"DESCRIPTION": "other description"},
  {"DESCRIPTION": null}
]
*/

subject.fieldComponent(model, false)
/* returns
{
  "title": {
    is: MyComponent,
    bind: {
      label: 'TITLE',
      required: true,
      validation: 'required',
    },
  }
}
*/

subject.build(model, 'title').getData() 
// returns null because it is not a FieldData

subject.build(model, 'description').getData() // returns 'my description'

subject.build(model, 'title').getComponent()
/* returns
{
  is: MyComponent,
  bind: {
    label: 'TITLE',
    required: true,
    validation: 'required',
  },
}
 */

subject.build(model, 'description').getComponent() 
// returns null because it is not a FieldComponent
```
