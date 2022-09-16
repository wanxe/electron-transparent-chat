<template>
  <div class="relative w-full h-full">
    <div class="sticky top-0 bg-gray-700/50 py-1">
      <h1 class="text-center text-amber-600 text-xs">Mensajes ({{ chatMessages.length }})</h1>
      <ChatOnlineIndicator :isOnline="isOnline" />
    </div>
    <ChatMessageStack class="px-2" :messages="chatMessages" />
  </div>
</template>

<script lang="ts" setup>
import ChatMessageStack from './ChatMessageStack.vue';
import ChatOnlineIndicator from './ChatOnlineIndicator.vue';
import { useStore } from '../store/appStore';
import { storeToRefs } from 'pinia';
const store = useStore();

const { isOnline, chatMessages } = storeToRefs(store);
</script>
