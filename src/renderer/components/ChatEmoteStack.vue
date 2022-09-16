<template>
  <div class="chat--emote-stack flex-shrink-0 flex gap-1 items-center justify-start">
    <img
      v-for="emote in props.emotes"
      class="flex-shrink-0"
      :key="emote"
      :src="emote || ''"
      lazy
      alt="emote"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  emotes: string[]
}>();
</script>
