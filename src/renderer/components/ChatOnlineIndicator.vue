<template>
  <span class="flex absolute h-3 w-3 top-1.5 right-2">
    <span v-if="isOnline" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3" :class="[{'bg-red-600': !isOnline}, {'bg-green-600': isOnline}]"></span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatOnlineIndicator',
  props: {
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
