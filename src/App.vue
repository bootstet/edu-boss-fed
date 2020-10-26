<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue'

interface Foo {
  a: number
  b: string
}

export default Vue.extend({
  name: 'App'
})
</script>

<style lang="scss" scoped>
  // @import "~@/styles/variables.scss";
  .text {
    color: $warning-color;
  }
</style>
