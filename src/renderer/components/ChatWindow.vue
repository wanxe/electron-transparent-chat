<template>
  <div class="relative w-full h-full overflow-y-auto">
    <div class="sticky top-0 bg-gray-700/50 py-1">
      <h1 class="text-center text-amber-600 text-xs">Mensajes ({{ messages.length }})</h1>
      <ChatOnlineIndicator :isOnline="isOnline" />
    </div>
    <ChatMessageStack class="px-2" :messages="messages" />
  </div>
</template>

<script lang="ts" setup>
import ChatMessageStack from './ChatMessageStack.vue';
import { useChatClient } from '../composables/useChatClient';
import ChatOnlineIndicator from './ChatOnlineIndicator.vue';
import { useOnlineCheck } from '../composables/useOnlineCheck';

const { messages } = useChatClient();
const { getStatus, isOnline } = useOnlineCheck();
getStatus();
</script>
