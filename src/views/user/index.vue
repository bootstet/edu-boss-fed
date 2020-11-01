<template>
  <div class="user">
    <UserList />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import UserList from './components/List.vue'

export default Vue.extend({
  name: 'User',
  components: {
    UserList
  }
})
</script>

<style lang="scss" scoped></style>
