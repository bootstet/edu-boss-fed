<template>
 <div class="menu-create">
		<CreateOrEdit/>
 </div>
</template>

<script type="ts">
import Vue from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'

export default Vue.extend({
	name: 'MenuCreate',
	data () {
		return {}
	},
	components: {
		CreateOrEdit
	}
})
</script>

<style scoped lang="scss">
</style>
