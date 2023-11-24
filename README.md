# Form Renderer library
This is Vue 3.x + Typescript library for rendering dynamic forms

## Pre requirements
Make sure you have installed the [voicenter-ui-plus](https://www.npmjs.com/package/@voicenter-team/voicenter-ui-plus) library

## Installation
1. run `yarn add @voicenter-team/forms-renderer` or `npm i @voicenter-team/forms-renderer`
2. Now you can use main component as:
```vue

<template>
    <FormRenderer
        v-model="formRendererModel"
        categories-display-type="collapse"
        :parameter-categories="formRendererParameterCategoriesList"
    />
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {FormRenderer} from '@voicenter-team/form-renderer'

const formRendererModel = ref<{ [key: string]: any }>({})
const formRendererParameterCategoriesList = [
    {
        uid: 1,
        name: 'Category 1',
        componentParameters: [
            {
                type: 'String',
                uid: 1,
                name: 'NameInput',
                propJpath: '$.name',
                parameterData: {
                    icon: 'vc-icon-answer',
                    type: 'text',
                    defaultValue: 'Defa',
                    subtitle: 'Subtitle',
                    title: 'Title',
                    mandatory: true,
                    helpText: 'Help Text',
                    validationRegex: '\\S',
                    validationMessage: 'The field is required and must contain only valid characters!'
                }
            },
            {
                type: 'YNSelect',
                uid: 2,
                name: 'IsDeveloper',
                propJpath: '$.isDeveloper',
                parameterData: {
                    icon: 'vc-icon-up',
                    defaultValue: true,
                    title: 'Is developer?',
                    helpText: 'Help Text',
                    mandatory: true,
                    subtitle: 'Subtitle',
                }
            },
            {
                type: 'String',
                uid: 3,
                name: 'WhyIsNotDeveloper',
                propJpath: '$.whyIsNotDeveloper',
                parameterData: {
                    icon: 'vc-icon-type',
                    defaultValue: '',
                    subtitle: 'Subtitle',
                    title: 'Why you are not developer?',
                    mandatory: true,
                    type: 'textarea',
                    helpText: 'Help Text',
                    validationRegex: '\\S',
                    validationMessage: 'Value cannot be empty!',
                    parameterConditions: [
                        {
                            parameterConditionList: [
                                {
                                    parameterConditionJPath: '$.isDeveloper',
                                    parameterConditionOperator: '=',
                                    parameterConditionValue: false
                                }
                            ]
                        },
                        {
                            parameterConditionList: [
                                {
                                    parameterConditionJPath: '$.name',
                                    parameterConditionOperator: '=',
                                    parameterConditionValue: 'notdev'
                                }
                            ]
                        }
                    ],
                }
            }
        ]
    }
]
</script>
```

## Documentation
Visit [documentation](https://form-renderer.pages.dev/) for detailed info
