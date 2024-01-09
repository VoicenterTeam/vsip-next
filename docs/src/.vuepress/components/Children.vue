<template>
    <div>
        <section>
            <div>
                <span>Microphone</span>
                <VcSelect
                    v-model="state.selectedInputDevice"
                    :options="inputDeviceOptions"
                    :config="{ labelKey: 'label', valueKey: 'deviceId' }"
                />
            </div>
            <div>
                <span>Speaker</span>
                <VcSelect
                    v-model="state.selectedOutputDevice"
                    :options="outputDeviceOptions"
                    :config="{ labelKey: 'label', valueKey: 'deviceId' }"
                />
            </div>
        </section>

        <section>
            <VcCheckbox v-model="muteWhenJoin">
                Mute when join
            </VcCheckbox>

            <VcCheckbox v-model="isDND">
                Use DND
            </VcCheckbox>
        </section>

        <section>
            <VcForm
                @submit="onPhoneInputSubmit"
            >
                <VcInput
                    v-model="targetInput"
                    prefix-icon="vc-icon-phone"
                    type="text"
                    placeholder="Enter phone number"
                    clearable
                />
            </VcForm>

            <VcCheckbox v-model="addCallToCurrentRoom">
                Add new call to current room
            </VcCheckbox>
        </section>

        <section>
            <div>
                <span>Microphone sensitivity (between 0 and 2)</span>
                <VcSlider
                    v-model="microphoneInputLevel"
                    :min="0"
                    :max="2"
                    :step="0.1"
                />
                {{ microphoneInputLevel }}
            </div>

            <div>
                <span>Speaker volume (between 0 and 1)</span>
                <VcSlider
                    v-model="speakerVolume"
                    :min="0"
                    :max="1"
                    :step="0.1"
                />
                {{ speakerVolume }}
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useVsipInject } from '@/index'
import { computed, ref } from "vue";

const { state, actions } = useVsipInject()
const {
    muteWhenJoin,
    isDND,
    addCallToCurrentRoom,
    microphoneInputLevel,
    speakerVolume
} = state

/* Data */

const targetInput = ref<string>('')

/* Computed */

const inputDeviceOptions = computed(() => {
    return state.inputMediaDeviceList.value
})

const outputDeviceOptions = computed(() => {
    return state.outputMediaDeviceList.value
})

/* Methods */

const onPhoneInputSubmit = (event) => {
    event.preventDefault()
    actions.doCall(targetInput.value, addCallToCurrentRoom.value)
    targetInput.value = ''
}

</script>
