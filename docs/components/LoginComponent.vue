<template>
    <VcForm
        ref="loginFormRef"
        :model="loginData"
        :rules="rules"
        @submit="login"
    >
        <div class="w-full">
            <VcFormItem
                prop="extraHeaders"
                required
                :error="message"
            >
                <VcInput
                    v-model="loginData.extraHeaders"
                    name="extraHeaders"
                    type="text"
                    prefix-icon="vc-icon-extensions text-primary-actions"
                    placeholder="Extra Headers"
                />
            </VcFormItem>
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
import { VcForm, VcFormItem, VcButton, VcInput } from '@voicenter-team/voicenter-ui-plus'

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from "firebase/messaging";

const { actions } = useVsipInject()

const loginFormRef = ref<typeof VcForm>()

const loginData = ref({
    extraHeaders: '',
    extension: '',
    password: '',
    domain: ''
})

const message = ref<string>('')
const rules = {
    extraHeaders: [
        {
            required: false
        }
    ],
    extension: [
        {
            required: true,
            message: 'Extension is required'
        }
    ],
    password: [
        {
            required: true,
            message: 'Password is required'
        }
    ],
    domain: [
        {
            required: true,
            message: 'Domain is required'
        }
    ]
}

const firebaseConfig = window.firebaseConfig

//const parsed = window.firebaseConfig

const VAPID_KEY = window.VAPID_KEY

const app = initializeApp(firebaseConfig);

//const messaging = getMessaging();

let token: string

async function requestNotificationPermission() {
    const messaging = getMessaging();

    try {
        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            console.log('Notification permission granted.');

            // Get the FCM token
            token = await getToken(messaging, { vapidKey: VAPID_KEY });

            if (token) {
                console.log('FCM Token:', token);
                // Use the token for sending notifications from your server
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } else {
            console.log('Notification permission denied.');
        }
    } catch (error) {
        console.error('An error occurred while requesting permission:', error);
    }
}

requestNotificationPermission()


// eslint-disable-next-line
const login = async (event: any) => {
    event.preventDefault()

    const resValid = await loginFormRef.value?.validate()
    if (!resValid?.isValid) {
        return
    }

    /*const pnParams = loginData.value.extraHeaders.split(';').reduce(
        (acc, item) => {
            if (typeof item !== 'string') {
                return acc
            }

            const [ key, value ] = item.split('=')

            if (typeof key !== 'string' || typeof value !== 'string') {
                return acc
            }

            acc[key] = value

            return acc
        },
        {}
    )*/

    const pnExtraHeaderes = {
        'pn-provider': 'fcm',
        'pn-param': 'voicenter-mobile',
        'pn-prid': token || '',
        'pn-strategy': 'all'
    }

    actions.init(
        loginData.value.domain,
        loginData.value.extension,
        loginData.value.password,
        pnExtraHeaderes
    )
}

</script>
