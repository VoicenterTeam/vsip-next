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
import { nextTick, onMounted, ref, watch } from 'vue'
import { useVsipInject } from '@/index'
import type { ICall, IRoom } from 'opensips-js/src/types/rtc'

const { actions } = useVsipInject()

const { moveCall } = actions

interface IProps {
    call: ICall
    roomsList?: Array<IRoom>
}

const props = withDefaults(
    defineProps<IProps>(),
    {
        roomsList: () => []
    }
)

const activeCallRoomId = ref<number | undefined>()
const isFirstRender = ref<boolean>(true)

watch(activeCallRoomId, (newV, oldV) => {
    if (newV === oldV || isFirstRender.value) {
        return
    }
    moveCall(props.call._id, newV ?? 0)
})

onMounted(() => {
    activeCallRoomId.value = props.call.roomId ? props.call.roomId : undefined
    nextTick(() => {
        isFirstRender.value = false
    })
})

</script>
