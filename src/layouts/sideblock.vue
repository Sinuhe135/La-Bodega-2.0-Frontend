<script setup lang="ts">
import type { SideblockItem } from '/@src/components/layouts/sideblock/sideblock.types'

const links = ref<SideblockItem[]>([
  {
    type: 'link',
    label: 'Accounts',
    icon: 'material-symbols:account-circle',
    to: '/app',
  },
])
</script>

<template>
  <SideblockLayout
    :links
    open-on-mounted
    size="large"
  >
    <slot />

    <template #logo>
      <h3 class="is-hidden-mobile ml-2">
        La Bodega
      </h3>
    </template>

    <template #toolbar>
      <div class="toolbar-link">
        <VDarkmodeToggle />
      </div>
    </template>

    <template #sideblock-end>
      <div class ="logout-button-container">
        <LogoutButton />
      </div>
    </template>
  </SideblockLayout>
</template>

<style lang="scss" scoped>
.logout-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
