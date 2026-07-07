<script setup lang="ts">
export interface CategoryElementProps {
  id: number
  categoryName: string
}

defineProps<CategoryElementProps>()
</script>

<template>
  <VCard>
    <div class="data-row">
      <span>Category name:</span>
      <p>{{ categoryName }}</p>
    </div>
  </VCard>
</template>

<style lang="scss" scoped>
  .data-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
</style>