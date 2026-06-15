<script setup lang="ts">
export interface CategoryElementProps {
  id: number
  categoryName: string
}

defineProps<CategoryElementProps>()
</script>

<template>
  <VCard>
    {{ categoryName }}
  </VCard>
</template>
