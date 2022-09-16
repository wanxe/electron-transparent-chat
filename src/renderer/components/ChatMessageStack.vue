<template>
  <div class="chat--message-stack h-full overflow-y-auto">
    <div
      v-for="item in props.messages"
      ref="stackItem"
      class="message--stack-item flex flex-wrap"
      :key="item.id"
    >
      <div
        class="font-semibold"
        :style="{ color: item.color}"
      >
        {{ item.userName }}<span class="text-gray-300">:</span>
      </div><div class="ml-1 text-gray-300">{{ item.message }}</div>
      <ChatEmoteStack :emotes="item.emotes" class="ml-2" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import { TwitchMessage } from '../typings/types';
import ChatEmoteStack from './ChatEmoteStack.vue';

const props = defineProps<{
  messages: TwitchMessage[]
}>();

const stackItem = ref(null);

watch(props.messages, async () => {
  await nextTick();
  const chatItems = stackItem.value;
  const lastMessage = chatItems.length > 0 ? stackItem.value.at(-1) : chatItems.value[0];
  lastMessage?.scrollIntoView({ block: 'end' });
});
</script>
