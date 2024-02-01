<template>
    <VcForm
        ref="loginFormRef"
        :model="loginData"
        :rules="rules"
        @submit="login"
    >
        <div class="w-1/3">
            <VcFormItem
                prop="extension"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.extension"
                    name="extension"
                    type="text"
                    prefix-icon="vc-icon-users text-primary-actions"
                    placeholder="Extension"
                />
            </VcFormItem>
            <VcFormItem
                prop="password"
                required
                :error="message"
            >
                <VcInput
                    v-model.trim="loginData.password"
                    name="password"
                    type="password"
                    prefix-icon="vc-icon-password text-primary-actions"
                    placeholder="Password"
                />
            </VcFormItem>
            <VcFormItem
                prop="domain"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.domain"
                    name="domain"
                    type="text"
                    autocomplete="on"
                    prefix-icon="vc-icon-server text-primary-actions"
                    placeholder="Domain"
                />
            </VcFormItem>
        </div>

        <VcButton
            color="primary"
            button-type="submit"
            class="mt-2"
        >
            Submit
        </VcButton>
    </VcForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useVsipInject } from '@/index'
import { VcForm } from '@voicenter-team/voicenter-ui-plus'

const { actions, state } = useVsipInject()

const loginFormRef = ref<typeof VcForm>()

const loginData = ref({
    extension: '',
    password: '',
    domain: ''
})

const message = ref<string>('')
const rules = {
    extension: [
        { required: true, message: 'Extension is required' }
    ],
    password: [
        { required: true, message: 'Password is required' }
    ],
    domain: [
        { required: true, message: 'Domain is required' }
    ]
}



const login = async (event) => {
    event.preventDefault()

    const { isValid } = await loginFormRef.value.validate()
    if (!isValid) {
        return
    }

    actions.init(
        loginData.value.domain,
        loginData.value.extension,
        loginData.value.password
    )
}

</script>
