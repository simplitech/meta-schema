import { FieldComponent, FieldSet, Schema } from '../src'

class MyComponent {}

class MyModel {
  title: string | null = null
  description: string | null = null
}

class MySchema extends Schema {
  translateFrom = (fieldName: string) => fieldName.toUpperCase() // my translation only put it on uppercase

  readonly fieldSet: FieldSet<MyModel> = {
    title: (schema): FieldComponent => ({
      is: MyComponent,
      bind: {
        label: this.translateFrom(schema.fieldName),
        required: true,
        validation: 'required',
      },
    }),
    description: schema => schema.model.description,
  }
}

describe("Schema", () => {
  it("can get all field names and headers", () => {
    const subject = new MySchema()

    expect(subject.allFields).toEqual(['title', 'description'])
    expect(subject.allHeaders).toEqual(['TITLE', 'DESCRIPTION'])
    expect(subject.header).toEqual({title: 'TITLE', description: 'DESCRIPTION'})
  })
  it("can build", () => {
    const subject = new MySchema()
    const model = new MyModel()
    model.title = 'my title'
    model.description = 'my description'

    const schemaBuilder = subject.build(model, 'title')
    expect(schemaBuilder.schema).toBe(subject)
    expect(schemaBuilder.model).toBe(model)
    expect(schemaBuilder.fieldName).toBe('title')
  })
  it("can get only field data list", () => {
    const subject = new MySchema()
    const m1 = new MyModel()
    m1.title = 'my title'
    m1.description = 'my description'
    const m2 = new MyModel()
    m2.title = 'other title'
    m2.description = 'other description'
    const m3 = new MyModel()
    m3.title = 'with null description'
    m3.description = null

    const fieldDataListNotTranslated = subject.fieldDataList([m1, m2, m3], false)
    expect(fieldDataListNotTranslated).toEqual([
      {"description": "my description"},
      {"description": "other description"},
      {"description": null}
    ])

    const fieldDataListTranslated = subject.fieldDataList([m1, m2, m3], true)
    expect(fieldDataListTranslated).toEqual([
      {"DESCRIPTION": "my description"},
      {"DESCRIPTION": "other description"},
      {"DESCRIPTION": null}
    ])
  })
  it("can get only field component list", () => {
    const subject = new MySchema()
    const m1 = new MyModel()
    m1.title = 'my title'
    m1.description = 'my description'
    const m2 = new MyModel()
    m2.title = 'other title'
    m2.description = 'other description'
    const m3 = new MyModel()
    m3.title = null
    m3.description = 'with null title'

    const expectedComputedTitleFieldComponent = {
      is: MyComponent,
      bind: {
        label: 'TITLE',
        required: true,
        validation: 'required',
      },
    }

    const fieldDataListNotTranslated = subject.fieldComponentList([m1, m2, m3], false)
    expect(fieldDataListNotTranslated).toEqual([
      {"title": expectedComputedTitleFieldComponent},
      {"title": expectedComputedTitleFieldComponent},
      {"title": expectedComputedTitleFieldComponent}
    ])

    const fieldDataListTranslated = subject.fieldComponentList([m1, m2, m3], true)
    expect(fieldDataListTranslated).toEqual([
      {"TITLE": expectedComputedTitleFieldComponent},
      {"TITLE": expectedComputedTitleFieldComponent},
      {"TITLE": expectedComputedTitleFieldComponent}
    ])
  })
  it("can get data", () => {
    const subject = new MySchema()
    const model = new MyModel()
    model.title = 'my title'
    model.description = 'my description'

    expect(subject.build(model, 'title').getData()).toBeNull()
    expect(subject.build(model, 'description').getData()).toBe('my description')
  })
  it("can get component", () => {
    const subject = new MySchema()
    const model = new MyModel()
    model.title = 'my title'
    model.description = 'my description'

    const expectedComputedTitleFieldComponent = {
      is: MyComponent,
      bind: {
        label: 'TITLE',
        required: true,
        validation: 'required',
      },
    }

    expect(subject.build(model, 'title').getComponent()).toEqual(expectedComputedTitleFieldComponent)
    expect(subject.build(model, 'description').getComponent()).toBeNull()
  })
})
