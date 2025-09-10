<template>
  <div>
    <ResponsiveSidebar 
      :is-mobile-menu-open="isMobileMenuOpen" 
      @close-mobile-menu="isMobileMenuOpen = false"
      @open-mobile-menu="isMobileMenuOpen = true"
    />
    
    <!-- Contenido principal -->
    <main :class="{ 'lg:ml-64': true, 'mobile-menu-open': isMobileMenuOpen }" class="pt-16 lg:pt-0 transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ResponsiveSidebar from './components/Layout/Sidebar.vue';

export default defineComponent({
  name: 'AppLayout',
  components: {
    ResponsiveSidebar
  },
  setup() {
    const isMobileMenuOpen = ref(false);
    
    return {
      isMobileMenuOpen
    };
  }
});
</script>

<style>
.mobile-menu-open {
  overflow: hidden;
}
</style>