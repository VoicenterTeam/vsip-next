import { TParametersCategory } from '../../../../src/types'

const formRendererParameterCategories: Array<TParametersCategory> = [
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
            },
            {
                type: 'String',
                uid: 4,
                name: 'Additional Prompt',
                parameterData: {
                    icon: 'vc-icon-type',
                    type: 'password',
                    mandatory: true,
                    parameterConditions: [
                        {
                            parameterConditionList: [
                                {
                                    parameterConditionJPath: '$.whyIsNotDeveloper',
                                    parameterConditionOperator: 'isEmpty'
                                }
                            ]
                        }
                    ],
                }
            },
            {
                type: 'IDataSelect',
                uid: 7,
                name: 'IDataSelect',
                propJpath: '$.iDataSelect',
                parameterData: {
                    icon: 'vc-icon-id',
                    title: 'Choose ID number',
                }
            },
            {
                type: 'DTSelect',
                uid: 5,
                name: 'BirthDate',
                propJpath: '$.birthDate',
                parameterData: {
                    icon: 'vc-icon-up',
                    title: 'When you born',
                    type: 'dts',
                    format: 'MM/dd/yyyy HH-mm-ss',
                    valueFormat: 'yyyy-MM-dd\'T\'HH-mm-ss.SSS\'Z\''
                }
            },
            {
                type: 'CustomComponent',
                uid: 6,
                name: 'Some Custom Component',
                propJpath: '$.test',
                parameterData: {
                    icon: 'vc-icon-type',
                }
            },
            {
                type: 'CustomComponentComplex',
                uid: 6,
                name: 'Some complex custom Component',
                propJpath: '$.testData',
                parameterData: {
                    icon: 'vc-icon-type',
                    validationRegex: "\\{\"campaignID\":([^,\"]+|\"[^\"]+\"),\"campaignDate\":[^,]+,\"target\":([^,\"]+|\"[^\"]+\"),\"callerName\":.*\\}",
                    validationMessage: "The Campaign, Date and target fields are required!",
                    validationFunction: (value: any) => {
                        console.log('value', value)

                        return { isValid: false, message: 'asd' }
                    }
                }
            }
        ]
    },
    {
        uid: 2,
        name: 'Category 2',
        componentParameters: [
            {
                type: 'String',
                uid: 21,
                name: 'NameInput',
                propJpath: '$.name21',
                parameterData: {
                    icon: 'vc-icon-answer',
                    type: 'text',
                    defaultValue: 'Default',
                    subtitle: 'Subtitle 2',
                    title: 'Title 2',
                    mandatory: true,
                    helpText: 'Help Text 2',
                    validationRegex: '\\S',
                    validationMessage: 'The field is required and must contain only valid characters!'
                }
            },
            {
                type: 'YNSelect',
                uid: 22,
                name: 'IsDeveloper',
                propJpath: '$.isDeveloper22',
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
                uid: 23,
                name: 'NameInput',
                propJpath: '$.name23',
                parameterData: {
                    icon: 'vc-icon-name',
                    type: 'text',
                    defaultValue: 'Name',
                    subtitle: 'Subtitle 3',
                    title: 'Title 3',
                    mandatory: true,
                    helpText: 'Help Text 3',
                    validationRegex: '\\S',
                    validationMessage: 'The field is required and must contain only valid characters!'
                }
            },
            {
                type: 'IDataSelect',
                uid: 24,
                name: 'Options',
                propJpath: '$.options2121',
                parameterData: {
                    icon: 'vc-icon-name',
                    title: 'Title 3'
                }
            },
            {
                type: 'IFileUpload',
                uid: 25,
                name: 'File Uploader!',
                propJpath: '$.thefcknfile',
                parameterData: {
                    icon: 'vc-icon-name',
                    title: 'FILE UPLOADER!',
                    multiple: true,
                    maxLength: 5,
                    accept: 'application/JSON',
                    showFileName: false,
                    outputSingleFile: true,
                    fileType: 'base64',
                }
            },
        ]
    }
]

export default formRendererParameterCategories
