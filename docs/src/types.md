# Types
[[toc]]

## TParametersCategory
```typescript
type TParametersCategory = {
    uid: number
    name: string
    componentParameters: Array<TPartialDataParameter>
}
```

## TPartialDataParameter
Partial data parameter is the generic type which extends [IParameterBase type](#iparameterbase) 
and by the provided `type` [TComponentType](#tcomponenttype) inherits type for `parameterData` prop.
Detailed info about [TBaseParameterData](#tbaseparameterdata)

## IParameterBase
```typescript
interface IParameterBase {
    type: TComponentType
    uid: number
    name: string
    propJpath: string
    parentId?: number
    parameterConditions?: Array<IParameterConditionGroup>
    parameterData: TBaseParameterData
}
```
| Prop                  | Description                                                                                                                                             |
|-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                  | The component to render, may be one of the [TComponentType](#tcomponenttype), or the custom passed component name                                       |
| icon                  | The icon that will be displayed near the label                                                                                                          |
| uid                   | The unique ID of the parameter                                                                                                                          |
| name                  | The name of the parameter                                                                                                                               |
| propJpath             | Has the following struct: `$.userData.name`, supports any valid for [jsponpath library](https://www.npmjs.com/package/jsonpath) struct. Must be unique! |
| parentId              |                                                                                                                                                         |
| parameterConditions   | If provided the field will be rendered only if meets conditions, see [detailed info](#iparameterconditiongroup)                                         |
| parameterData         | [TBaseParameterData](#tbaseparameterdata)                                                                                                               |
## TBaseParameterData
```typescript
type TBaseParameterData {
    title: string
    mandatory: boolean
    defaultValue?: unknown
    subtitle: string
    helpText: string
    validationRegex: string
    validationMessage: string
    icon?: string
    [key: string]: any
}
```
| Prop                | Description                                                                                                                            |
|---------------------|:---------------------------------------------------------------------------------------------------------------------------------------|
| title               | Used as a label for the field                                                                                                          |
| mandatory           | If to show asterisk for the label                                                                                                      |
| defaultValue        | The default value for the field                                                                                                        |
| subtitle            | -                                                                                                                                      |
| helpText            | -                                                                                                                                      |
| validationRegex     | The regex string which will be used for field validation if provided                                                                   |
| validationMessage   | The error message which will be shown if validation fails                                                                              |
Each of the [parameters](#tcomponenttype) has its own extended parameterDataType:
### IStringParameterData
```typescript
interface IStringParameterData extends TBaseParameterData {
    defaultValue: string
    type?: VcInputType
}
```
### INSelectParameterData
```typescript
interface INSelectParameterData extends TBaseParameterData {
    defaultValue: number
    min: number
    max: number
}
```
### IYNSelectParameterData
```typescript
interface IYNSelectParameterData extends TBaseParameterData {
    defaultValue: boolean
}
```
### IPNInputParameterData
```typescript
interface IPNInputParameterData extends TBaseParameterData {
    defaultValue: string
}
```
### ILangSelectParameterData
```typescript
interface ILangSelectParameterData extends TBaseParameterData {
    defaultValue: string
}
```
### IAOTSelectParameterData
```typescript
interface IAOTSelectParameterData extends TBaseParameterData {
    defaultValue: number
    max?: number
    min?: number
    step?: number
}
```
### IDTSelectParameterData
```typescript
interface IDTSelectParameterData extends TBaseParameterData {
    defaultValue: string
    type: 'dts' | 'dt' | 'd' // If 'dts' - the date-time picker with seconds will be shown, if 'dt' - the date-time picker will be shown, if 'd' - date picker
    format?: string // The format to which parse the in the input. Ex: dd-MM-yyyy HH:mm:ss. Accepts any valid date-fns library formats
    valueFormat?: string // The format to which parse the value. Ex: dd-MM-yyyy HH:mm:ss. Accepts any valid date-fns library formats
}
```
### IISelectParameterData
```typescript
interface IISelectParameterData extends TBaseParameterData {
    defaultValue: SelectModelType
    options: Array<TSelectOption>
}
```
### IMISelectParameterData
```typescript
interface IMISelectParameterData extends TBaseParameterData {
    defaultValue: SelectModelType
    options: Array<TSelectOption>
}
```
## IParameterConditionGroup
```typescript
export interface IParameterConditionGroup {
    parameterConditionList: Array<TParameterCondition>
}
```
## TParameterCondition
```typescript
export type TParameterCondition = {
    parameterConditionJPath: string
    parameterConditionOperator: '<=' | 'isEmpty' | 'isNotEmpty' | '<' | '=' | '>' | '>='
    parameterConditionValue: string | number // Only required when specified parameterConditionOperator which has value for comparison
}
```
For parameter data the logic is:
- Outer array elements are OR condition
- Inner array elements are AND condition

For example such configuration:
```typescript
const conditions: Array<Array<TParameterCondition>> = [
    [
        {
            parameterConditionJPath: '$.name',
            parameterConditionOperator: 'isEmpty'
        },
    ],
    [
        {
            parameterConditionJPath: '$.age',
            parameterConditionOperator: '>',
            parameterConditionValue: 2,
        },
        {
            parameterConditionJPath: '$.name',
            parameterConditionOperator: '=',
            parameterConditionValue: 'none'
        }
    ]
]
```
Means that the parameter will be displayed if (the `name` has no value) OR (`name` equals to 'none' AND value of `age` is bigger than 2) 

## TComponentType
```typescript
type TComponentType = 'NSelect' | 'IDataSelect' | 'YNSelect' | 'DTSelect' | 'PNInput' | 'LangSelect' | 'String' | 'AotSelect' | 'MISelect' | 'ISelect'
```

## TParameterCategoryDisplayTypeNames
```typescript
type TParameterCategoryDisplayTypeNames = 'plain' | 'collapse'
```

## FormPromiseType
```typescript
type FormPromiseType = {
    isValid: boolean
    invalidFields: unknown
}
```

## ICustomComponents
```typescript
import { Component } from 'vue'

export interface ICustomComponents {
    [key: string]: Component
}
```
