<template>
  <div class="grid py-2 h-full">
    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import './main.css';
import ChatWindow from './components/ChatWindow.vue';
</script>

<style>
html, #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply m-0 p-0 h-full bg-gray-700/[0.2];
}
</style>
