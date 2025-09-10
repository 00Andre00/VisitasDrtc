<template>
  <PublicLayout v-if="$route.meta.public" />
  <div v-else class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import PublicLayout from '@/components/Layout/PublicLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Sidebar,
    PublicLayout
  }
});
</script>