# Components

The library do exports the following components:
[[toc]]

## FormRenderer
### Description
The main component that handles the render of the form.

### Example
#### Basic Usage
```vue
<template>
    <FormRenderer
        v-model="formRendererModel"
        categories-display-type="collapse"
        :parameter-categories="formRendererParameterCategoriesList"
    />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ObjectAnyType } from '@voicenter-team/form-renderer/library/types/types/generic'
import { TParametersCategory } from '@voicenter-team/form-renderer/library/types/types/parametersCategory'

/* Data */
const formRendererModel = ref<ObjectAnyType>({})
const parameterCategories: Array<TParametersCategory> = [ /* Your categories here */ ]
</script>
```
#### Providing some custom component
```vue
<template>
    <FormRenderer
        v-model="formRendererModel"
        categories-display-type="collapse"
        :parameter-categories="formRendererParameterCategoriesList"
        :custom-components="{ CustomComponent }"
    />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ObjectAnyType } from '@voicenter-team/form-renderer/library/types/types/generic'
import { TParametersCategory } from '@voicenter-team/form-renderer/library/types/types/parametersCategory'
import { CustomComponent } from 'src/components/CustomComponent.vue'

/* Data */
const formRendererModel = ref<ObjectAnyType>({})
const parameterCategories: Array<TParametersCategory> = [ /* Your categories here */ ]
</script>
```
Where the CustomComponent is:
```vue
<template>
    <div>
        <p>{{ parameterData.someTitle }}</p>
        <input type="text" v-model="model">
        <p>{{ model }}</p>
    </div>
</template>
<script lang="ts" setup>
import { TBaseParameterData } from '@voicenter-team/form-renderer/library/types/types/parameterData'
import { ExtendParameterDataType } from '@voicenter-team/form-renderer/library/types/types/parameter'
import { ObjectAnyType } from '@voicenter-team/form-renderer/library/types/types/generic'
import { useDynamicComponent } from '@voicenter-team/form-renderer'

export interface ICustomComponentParameterData extends TBaseParameterData {
    defaultValue: string
    someTitle: string
}

export type TCustomComponentParameter = ExtendParameterDataType<'CustomParameter', ICustomComponentParameterData>

/* Props */
export type Props = {
    modelValue: ObjectAnyType
    parameter: TCustomComponentParameter
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', payload: Props['modelValue']): void
}>()

/* Data */
const parameterData: ICustomComponentParameterData = {
    ...props.parameter.parameterData,
    someTitle: props.parameter.parameterData.someTitle ?? 'TEST'
}

const model = useDynamicComponent(props, parameterData, emit)
</script>
```

### API
#### Attributes
| Name                    | Description                          | Type                                                                                               | Default |
|-------------------------|:-------------------------------------|:---------------------------------------------------------------------------------------------------|:--------|
| parameter-categories    | The list of categories to render     | array [see TParametersCategory](/types.html#tparameterscategory)                                   | -       |
| model-value / v-model   | The model of the form                | object                                                                                             | -       |
| categories-display-type | How categories will be displayed     | string [see TParameterCategoryDisplayTypeNames](/types.html#tparametercategorydisplaytypenames)    | plain   |
| custom-components       | Some custom vue components to render | object [see ICustomComponents](/types.html#icustomcomponents)                                      | {}      |

#### Events
| Name              | Description                | Type   |
|-------------------|:---------------------------|:-------|
| update:modelValue | When the form model change | object |

#### Slots
| Name                             | Description                    |
|----------------------------------|:-------------------------------|
| parameter-category-{categoryUid} | Dynamic slot for each category |

#### Exposes
| Name                     | Description                         | Type        |
|--------------------------|:------------------------------------|:------------|
| validateAllCategories    | Will validate all categories        | function    |
| resetAllCategoriesFields | Will reset all categories fields    | function    |
| validateCategory         | Will validate category              | function    |
| resetCategoryFields      | Will reset specific category fields | function    |
