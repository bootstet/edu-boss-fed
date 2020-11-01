<template>
	<div class="alloc-menu">
		<el-card>
			<div slot="header">
				<span>分配权限</span>
			</div>
			<el-tree
				ref="menu-tree"
				:data="menus"
				:props="defaultProps"
				:default-checked-keys="checkedKeys"
				node-key='id'
				show-checkbox
				@node-click="handleNodeClick"
				default-expand-all
				>
			</el-tree>
			<div style="text-align: center">
				<el-button @click="resetChecked">清空</el-button>
				<el-button type="primary" @click="onSave">保存</el-button>
			</div>
		</el-card>
	</div>
</template>

<script type="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default Vue.extend({
	name: 'AllocMenu',
	props: {
		roleId: {
			type: [String, Number],
			required: true
		}
	},
	data () {
		return {
			menus: [],
			defaultProps: {
				children: 'subMenuList',
				label: 'name'
			},
			checkedKeys: []
		}
	},
	created () {
		this.loadMenus()
		this.loadRoleMenus()
	},
	methods: {
		async loadRoleMenus () {
			const { data } = await getRoleMenus(this.roleId)
			console.log(data)
			this.getCheckedKeys(data.data)
		},
		getCheckedKeys (menus) {
			menus.forEach((menu) => {
				if (menu.selected) {
					// this.checkedKeys.push(menu.id)
					this.checkedKeys = [...this.checkedKeys, menu.id]
				}
				if (menu.subMenuList) {
					this.getCheckedKeys(menu.subMenuList)
				}
			})
		},
		async loadMenus () {
			const { data } = await getMenuNodeList()
			this.menus = data.data
		},
		async onSave () {
			const menuIdList = (this.$refs['menu-tree']).getCheckedKeys()
			console.log(menuIdList)
			await allocateRoleMenus({
				roleId: this.roleId,
				menuIdList
			})
			this.$message.success('操作成功')
			this.$router.back()
		},
		handleNodeClick (data) {
			console.log(data)
		},
		resetChecked () {
			this.$refs['menu-tree'].setCheckedKeys([])
		}
	}
})
</script>

<style scoped lang="scss">
</style>
