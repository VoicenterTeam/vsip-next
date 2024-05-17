<template>
    <div>
        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <div>
                <span>Microphone</span>
                <VcSelect
                    v-model="selectedInputDevice"
                    :options="inputDeviceOptions"
                    :config="{ labelKey: 'label', valueKey: 'deviceId' }"
                />
            </div>
            <div>
                <span>Speaker</span>
                <VcSelect
                    v-model="selectedOutputDevice"
                    :options="outputDeviceOptions"
                    :config="{ labelKey: 'label', valueKey: 'deviceId' }"
                />
            </div>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <VcCheckbox v-model="muteWhenJoin">
                Mute when join
            </VcCheckbox>

            <VcCheckbox v-model="isDND">
                Use DND
            </VcCheckbox>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <VcButton
                color="primary"
                :disabled="muteButtonDisabled"
                @click="doMute(!isMuted)"
            >
                {{ muteButtonText }}
            </VcButton>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <VcForm
                @submit="onPhoneInputSubmit"
            >
                <span>Phone number input</span>
                <div class="flex">
                    <VcInput
                        v-model="targetInput"
                        prefix-icon="vc-icon-phone"
                        type="text"
                        placeholder="Enter phone number"
                        clearable
                    />

                    <VcButton
                        color="primary"
                        button-type="submit"
                        class="ml-2"
                    >
                        Call
                    </VcButton>
                </div>
            </VcForm>

            <VcCheckbox v-model="addCallToCurrentRoom">
                Add new call to current room
            </VcCheckbox>

            <div v-if="callAddingInProgress">Calling...</div>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <div>
                <span>Microphone sensitivity</span>
                <VcSlider
                    v-model="microphoneInputLevel"
                    :min="0"
                    :max="1"
                    :step="0.1"
                />
            </div>

            <div>
                <span>Speaker volume</span>
                <VcSlider
                    v-model="speakerVolume"
                    :min="0"
                    :max="1"
                    :step="0.1"
                />
            </div>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <VcForm
                @submit="onDtmfInputSubmit"
            >
                <span>DTMF input</span>
                <div class="flex">
                    <VcInput
                        v-model="dtmfInput"
                        prefix-icon="vc-icon-ivrs"
                        type="text"
                        placeholder="Enter DTMF"
                        clearable
                    />
                    <VcButton
                        color="primary"
                        button-type="submit"
                        class="ml-2"
                        :disabled="dtmfButtonDisabled"
                    >
                        Send
                    </VcButton>
                </div>
            </VcForm>
        </section>

        <section class="xs:w-full sm:w-1/2 lg:w-1/3 pb-4">
            <span>
                Active calls: {{ Object.keys(activeCalls).length }}
            </span>
            <div>
                <span>Your room:</span>
                <div class="w-36">
                    <VcSelect
                        v-model="currentActiveRoomId"
                        :options="roomsListOptions"
                        :config="{ labelKey: 'label', valueKey: 'roomId' }"
                    />
                </div>
            </div>
        </section>

        <section class="w-full pb-4">
            <span>
                Rooms list:
            </span>

            <div v-for="room in roomsList" :key="room.roomId">
                <span>Room {{ room.roomId }}</span>: ({{ room.started }})
                <br>
                <ul>
                    <li v-for="(call, index) in getActiveCallsInRoom(room.roomId)" :key="index" class="p-2">

                        <b>{{ callTime[call._id]?.formatted }}</b>
                        <b>{{ call._remote_identity }}</b>

                        <VcButton
                            class="ml-2"
                            color="primary"
                            @click="doCallerMute(call._id, !call.localMuted)"
                        >
                            {{ call.localMuted ? 'Unmute' : 'Mute' }}
                        </VcButton>

                        <VcButton
                            class="ml-2"
                            color="destructive-actions"
                            @click="terminateCall(call._id)"
                        >
                            Hangup
                        </VcButton>

                        <VcButton
                            class="ml-2"
                            color="primary"
                            @click="doCallTransfer(call._id)"
                        >
                            Transfer
                        </VcButton>

                        <VcButton
                            v-if="getActiveCallsInRoom(room.roomId).length === 2"
                            class="ml-2"
                            color="primary"
                            @click="mergeCall(room.roomId)"
                        >
                            Merge room {{room.roomId}}
                        </VcButton>

                        <VcButton
                            class="ml-2"
                            color="primary"
                            :disabled="isHoldButtonDisable(call)"
                            @click="doCallHold(call._id, !call._localHold)"
                        >
                            {{ call._localHold ? 'UnHold' : 'Hold' }}
                        </VcButton>

                        <VcButton
                            v-if="call.direction !== CONSTRAINTS.CALL_DIRECTION_OUTGOING && !call._is_confirmed"
                            class="ml-2"
                            color="primary"
                            @click="answerCall(call._id)"
                        >
                            Answer
                        </VcButton>

                        <div>
                            <CallMoveSelect
                                :call="call"
                                :rooms-list="roomsList"
                            />
                        </div>
                    </li>
                </ul>
            </div>

        </section>

    </div>
</template>

<script setup lang="ts">
import { ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'
import CallMoveSelect from './CallMoveSelect.vue'
import { useVsipInject } from '@/index'
//import { useVsipInject } from '../../../../library/super.mjs'
import { computed, ref } from "vue"
import { CONSTRAINTS } from '../enum'

const { state, actions } = useVsipInject()
const {
    selectedInputDevice,
    selectedOutputDevice,
    muteWhenJoin,
    isDND,
    addCallToCurrentRoom,
    microphoneInputLevel,
    speakerVolume,
    isMuted,
    callAddingInProgress,
    activeCalls,
    callsInActiveRoom,
    currentActiveRoomId,
    activeRooms,
    callTime
} = state

const {
    initCall,
    sendDTMF,
    muteCaller,
    unmuteCaller,
    terminateCall,
    transferCall,
    mergeCall,
    holdCall,
    unholdCall,
    answerCall,
    moveCall,
    mute,
    unmute
} = actions

/* Data */

const targetInput = ref<string>('')
const dtmfInput = ref<string>('')

/* Computed */

const inputDeviceOptions = computed(() => {
    return state.inputMediaDeviceList.value
})

const outputDeviceOptions = computed(() => {
    return state.outputMediaDeviceList.value
})

const muteButtonDisabled = computed(() => {
    return Object.keys(activeCalls.value).length === 0
})

const muteButtonText = computed(() => {
    return isMuted.value ? 'Unmute' : 'Mute'
})

const dtmfButtonDisabled = computed(() => {
    return Object.keys(activeCalls.value).length !== 1
})

const roomsList = computed(() => {
    return Object.values(activeRooms.value) as Array<IRoom>
})

const roomsListOptions = computed(() => {
    const unselectedOption = {
        roomId: undefined,
        label: 'No room selected'
    }

    const rooms = roomsList.value.map((room) => ({
        ...room,
        label: room.roomId
    }))
    const allOptions = [
        unselectedOption,
        ...rooms
    ]
    return allOptions
})

/* Methods */

const onPhoneInputSubmit = (event) => {
    event.preventDefault()

    if (callAddingInProgress.value) {
        return
    }

    initCall(targetInput.value, addCallToCurrentRoom.value)
    targetInput.value = ''
}

const onDtmfInputSubmit = (event) => {
    event.preventDefault()

    if (callsInActiveRoom.value.length !== 1) {
        return
    }
    const firstCallInRoom = callsInActiveRoom.value[0] as ICall
    sendDTMF(firstCallInRoom.id, dtmfInput.value)
    dtmfInput.value = ''
}

const getActiveCallsInRoom = (roomId: number): Array<ICall> => {
    return Object.values(activeCalls.value).filter((call: ICall) => call.roomId === roomId)
}

const doCallTransfer = (callId: string) => {
    const target = prompt('Please enter target:')

    if (target !== null || target !== '') {
        transferCall(callId, target)
    }
}

const doCallHold = (callId: string, toHold: boolean) => {
    if (toHold) {
        holdCall(callId)
    } else {
        unholdCall(callId)
    }
}

const doCallerMute = (callId: string, toMute: boolean) => {
    if (toMute) {
        muteCaller(callId)
    } else {
        unmuteCaller(callId)
    }
}

const doMute = (value: boolean) => {
    if (value) {
        mute()
    } else {
        unmute()
    }
}

const isHoldButtonDisable = (call: ICall) => {
    return call._localHold
        ? currentActiveRoomId.value !== call.roomId
        : currentActiveRoomId.value !== call.roomId || call.status === CONSTRAINTS.CALL_STATUS_UNANSWERED
}

</script>

<style lang="scss" scoped>

</style>
