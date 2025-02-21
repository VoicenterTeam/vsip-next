---
title: Getting started
description: This library is a wrapper over the opensips-js implementation.
navigation:
  title: Getting Started
---

# Getting started

## Description
This library is a wrapper over the opensips-js implementation.
It provides a Vue 3 composable for reactive work with opensips-js functionality.
Call `useVsipProvide` on the top level of Vue components and then use `useVsipInject` in the child components to use reactive opensips-js functionality.

## Basic Usage
*ProviderWrapper.vue*
```vue [ProviderWrapper.vue]
<template>
  <div ref="wrapper">
    <VSipPhone v-if="state.isInitialized" />
    <div v-else>Not initialized</div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useVsipProvide } from '@voicenter-team/vsip-next'
import VSipPhone from '@/VSipPhone.vue'

const { actions, state } = useVsipProvide()
actions.init('wss07.voicenter.co', '', '')
</script>
```
*VSipPhone.vue*
```vue [VSipPhone.vue]
<template>
    ...
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useVsipInject } from '@/index'

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
  activeRooms
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

/* Other code */
</script>
```


## Composable
### State
| Name                  | Description                                                | Type                                   | Default   |
|-----------------------|:-----------------------------------------------------------|:---------------------------------------|:----------|
| isInitialized         | Defines if opensips-js is initialized                      | boolean                                | false     |
| activeCalls           | Active calls                                               | { [key: string]: ICall }               | {}        |
| callsInActiveRoom     | Calls in active room                                       | Array\<Call>                           | []        |
| activeMessages        | Active MSRP messages                                       | { [key: string]: IMessage }            | {}        |
| addCallToCurrentRoom  | Defines if new call should be added to current room        | boolean                                | false     |
| callAddingInProgress  | Represents call id of progressing call if such call exists | string / undefined                     | undefined |
| activeRooms           | Active rooms                                               | { [key: number]: IRoom }               | {}        |
| msrpHistory           | MSRP messages history                                      | { [key: string]: Array\<MSRPMessage> } | {}        |
| availableMediaDevices | List of available media devices                            | Array\<MediaDeviceInfo>                | []        |
| inputMediaDeviceList  | List of available input media devices                      | Array\<MediaDeviceInfo>                | []        |
| outputMediaDeviceList | List of available output media devices                     | Array\<MediaDeviceInfo>                | []        |
| selectedOutputDevice  | ID of selected output device                               | string                                 | 'default' |
| selectedInputDevice   | ID of selected input device                                | string                                 | 'default' |
| muteWhenJoin          | Defines if agent will be muted when joining call           | boolean                                | false     |
| isDND                 | Defines usage agent's 'Do Not Disturb' option              | boolean                                | false     |
| originalStream        | Agent's Audio Stream object                                | MediaStream / null                     | null      |
| currentActiveRoomId   | Defines agent's active room                                | number / undefined                     | undefined |
| callStatus            | Calls' statuses                                            | { [key: string]: ICallStatus }         | {}        |
| callTime              | Calls' times                                               | { [key: string]: ITimeData }           | {}        |
| callMetrics           | Calls' metrics                                             | { [key: string]: unknown }             | {}        |
| autoAnswer            | Defines if auto-answer is enabled                          | boolean                                | false     |
| microphoneInputLevel  | Microphone sensitivity (range is from 0 to 2)              | number                                 | 2         |
| speakerVolume         | Speaker volume (range is from 0 to 1)                      | number                                 | 1         |


### Methods
| Name                     | Interface                                                                    | Description                                                      |
|--------------------------|:-----------------------------------------------------------------------------|:-----------------------------------------------------------------|
| init                     | (domain: string, username: string, password: string): void                   | Initialize opensips-js                                           |
| initCall                 | (target: string, addToCurrentRoom: boolean, holdOtherCalls: boolean) => void | Make a call                                                      |
| answerCall               | (callId: string) => void                                                     | Answer call                                                      |
| terminateCall            | (callId: string) => void                                                     | Hangup call                                                      |
| muteCaller               | (callId: string) => void                                                     | Mute caller                                                      |
| unmuteCaller             | (callId: string) => void                                                     | Unmute caller                                                    |
| mute                     | () => void                                                                   | Mute ourself                                                     |
| unmute                   | () => void                                                                   | Unmute ourself                                                   |
| transferCall             | (callId: string, target: string) => void                                     | Transfer call                                                    |
| mergeCall                | (roomId: number) => void                                                     | Merge calls in room (works only when 2 call in room)             |
| mergeCallByIds           | (firstCallId: string, secondCallId: string) => void                          | Merge calls by their ids                                         |
| holdCall                 | (callId: string, automatic?: boolean) => void                                | Hold a call                                                      |
| unholdCall               | (callId: string) => void                                                     | Unhold a call                                                    |
| moveCall                 | (callId: string, roomId: number) => Promise\<void>                           | Move call to another room                                        |
| setMicrophone            | (deviceId: string) => Promise\<void>                                         | Set microphone which to use                                      |
| setSpeaker               | (deviceId: string) => Promise\<void>                                         | Set speaker which to use                                         |
| sendDTMF                 | (callId: string, value: string) => void                                      | Send DTMF                                                        |
| setActiveRoom            | (roomId: number / undefined) => Promise\<void>                               | Set current active room                                          |
| setMicrophoneSensitivity | (value: number) => void                                                      | Set microphone sensitivity. Value should be in range from 0 to 1 |
| setSpeakerVolume         | (value: number) => void                                                      | Set speaker volume. Value should be in range from 0 to 1         |
| setAutoAnswer            | (value: boolean) => void                                                     | Set auto-answer                                                  |
| setDND                   | (state: boolean) => void                                                     | Set 'Do not Disturb' option                                      |
| msrpAnswer               | (callId: string) => void                                                     | Answer MSRP invite                                               |
| messageTerminate         | (callId: string) => void                                                     | Terminate MSRP session                                           |
| sendMSRP                 | (msrpSessionId: string, body: string) => void                                | Send MSRP message                                                |
| initMSRP                 | (target: string, body: string, options: object) => void                      | Send MSRP invite                                                 |
