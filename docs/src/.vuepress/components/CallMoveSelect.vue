<template>
    <div>
        <span>
            Move call
        </span>
        <div class="w-12">
            <VcSelect
                v-model="activeCallRoomId"
                :options="props.roomsList"
                :config="{ labelKey: 'roomId', valueKey: 'roomId' }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, PropType, ref, watch } from 'vue'
import { useVsipInject } from '@/index'
//import { useVsipInject } from '../../../../library/super.mjs'
import { ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'

const { state, actions } = useVsipInject()

const {
    moveCall
} = actions

const props = defineProps({
    call: {
        type: Object as PropType<ICall>,
        required: true
    },
    roomsList: {
        type: Object as PropType<Array<IRoom>>,
        default: () => ([])
    }
})

const activeCallRoomId = ref<number | undefined>()
const isFirstRender = ref<boolean>(true)

watch(activeCallRoomId, (newV, oldV) => {
    if (newV === oldV || isFirstRender.value) {
        return
    }
    moveCall(props.call._id, newV)
})

onMounted(() => {
    activeCallRoomId.value = props.call.roomId ? props.call.roomId : undefined
    nextTick(() => {
        isFirstRender.value = false
    })
})

</script>
