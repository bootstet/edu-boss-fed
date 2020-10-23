<template>
  <div id="app">
    <h1>App</h1>
    <!-- 根基路由出口 -->
    <router-view/>
    <p class="text">hello </p>

  </div>
</template>
<script lang='ts'>
import Vue from 'vue'
import request from '@/utils/request'

request({
  method: 'GET',
  url: '/boss/v2/api-docs?group=edu-boss-boot'
}).then(res => {
  console.log(res)
})

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
