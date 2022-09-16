<template>
  <div class="h-full w-full draggable relative">
    <ChatWrapper />
  </div>
</template>

<script setup lang="ts">
import './main.css';
import ChatWrapper from './components/ChatWrapper.vue';
import { useStore } from './store/appStore';
const store = useStore();
store.init();
</script>

<style>
html, body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply m-0 p-0 bg-gray-700/[0.2];
}

.draggable {
  -webkit-app-region: drag;
}
</style>
