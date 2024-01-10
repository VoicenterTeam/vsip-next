<template>
    <div>
        <span>
            Move call
        </span>
        <VcSelect
            v-model="activeCallRoomId"
            :options="props.roomsList"
            :config="{ labelKey: 'roomId', valueKey: 'roomId' }"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, watch } from 'vue'
import { useVsipInject } from '@/index'
import { ICall, IRoom } from '@voicenter-team/opensips-js/src/types/rtc'

const { state, actions } = useVsipInject()

const {
    callMove
} = actions

const props = defineProps({
    call: {
        type: Object as PropType<ICall>,
        required: true
    },
    /*callId: {
        type: String,
        required: true
    },
    roomId: {
        type: Number
    },*/
    roomsList: {
        type: Object as PropType<Array<IRoom>>,
        default: () => ([])
    }
})

//const activeCallRoomId = ref<number | undefined>(props.roomId ? props.roomId : undefined)
const activeCallRoomId = ref<number | undefined>()

watch(activeCallRoomId, (newV, oldV) => {
    if (newV === oldV) {
        return
    }
    callMove(props.call._id, newV)
})

onMounted(() => {
    activeCallRoomId.value = props.call.roomId ? props.call.roomId : undefined
})

</script>
