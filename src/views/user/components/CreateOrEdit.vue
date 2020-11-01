<template>
	<div class="page">
		<el-form>
			<el-form-item label="角色名称">
				<el-input v-model='role.name'></el-input>
			</el-form-item>
			<el-form-item label="角色编码">
				<el-input v-model='role.code'></el-input>
			</el-form-item>
			<el-form-item label="角色描述">
				<el-input v-model='role.description'></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="$emit('cancel')">取消</el-button>
				<el-button type="paimary" @click="onSubmit">确认</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script type="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'

export default Vue.extend({
	name: 'roleEditOrUpdate',
	props: {
		roleId: {
			type: [String, Number]
		},
		isEdit: {
			type: Boolean,
			defaule: false
		}
	},
	data () {
		return {
			role: {
				code: '',
				name: '',
				description: ''
			}
		}
	},
	created () {
		console.log(this.isEdit)
		if (this.isEdit) {
			this.loadRole()
		}
	},
	methods: {
		async onSubmit () {
			const { data } = await createOrUpdate(this.role)
			console.log(data)
			this.$message.success('success')
			this.$emit('success')
		},
		async loadRole () {
			const { data } = await getRoleById(this.roleId)
			this.role = data.data
		}
	}
})
</script>

<style scoped lang="scss">
</style>
