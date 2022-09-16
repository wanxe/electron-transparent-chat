<template>
  <div class="grid h-full w-full">
    <ChatWrapper />
  </div>
</template>

<script setup lang="ts">
import './main.css';
import ChatWrapper from './components/ChatWrapper.vue';
</script>

<style>
html, #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @apply m-0 p-0 h-full bg-gray-700/[0.2];
}

body {
  overflow: hidden;
}
</style>
