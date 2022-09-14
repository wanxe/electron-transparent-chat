<template>
  <div class="px-2 relative">
    <h1 class="text-center text-amber-600 text-xs sticky top-0 bg-gray-700/[0.2]">Mensajes ({{ messages.length }})</h1>
    <ChatMessageStack :messages="messages" />
  </div>
</template>

<script lang="ts" setup>
import ChatMessageStack from './ChatMessageStack.vue';
import { useChatClient } from '../composables/useChatClient';

const { messages } = useChatClient();
</script>
