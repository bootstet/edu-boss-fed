<template>
  <div class="resource">
    <ResourceList />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import ResourceList from './components/List.vue'

export default Vue.extend({
  name: 'Resource',
  components: {
    ResourceList
  }
})
</script>

<style lang="scss" scoped></style>
