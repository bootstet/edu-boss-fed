<template>
	<div class="page">
		<el-card>
			<div class="clearfix">
				<el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
				<el-form-item prop="name" label="输入搜索">
					<el-input v-model="form.name" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="onSubmit"
						:disabled="isLoading"
					>查询</el-button>
					<el-button
						:disabled="isLoading"
						type="primary"
						@click="onReset"
					>重置</el-button>
				</el-form-item>
			</el-form>
			</div>
		</el-card>
		<el-card  class="box-card">
			<div slot="header"  class="clearfix">
				<el-button @click="addRole">添加角色</el-button>
			</div>
			<el-table
				:data="roles"
				style="width: 100%">
				<el-table-column
					type="index"
					label="编号"
					>
				</el-table-column>
				<el-table-column
					prop="name"
					label="角色名称"
					>
				</el-table-column>
				<el-table-column
					prop="description"
					label="描述"
					>
				</el-table-column>
				<el-table-column
					prop="createdTime"
					label="添加时间"
					>
					<template slot-scope="scope">
						<div>{{ dayDataformat(scope.row.createdTime) }}</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="createdTime"
					label="操作"
					width="150px"
					align="center"
					>
					<template slot-scope="scope">
						<div>
							<el-button
								type="text"
								@click="$router.push({
									name: 'alloc-menu',
									params: {
										roleId: scope.row.id
									}
								})"
								size="mini"
								>分配菜单</el-button>
							<el-button
								type="text"
								@click="handleEdit(scope.id)"
								size="mini"
								>分配资源</el-button>
						</div>
						<div>
							<el-button
								type="text"
								@click="handleEdit(scope.row.id)"
								size="mini"
								>编辑</el-button>
							<el-button
								type="text"
								@click="handleDelete(scope.row.id)"
								size='mini'
								>删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			:title="isEdit ? '编辑角色' : '添加角色'"
			:visible.sync="dialogVisible"
			width="30%"
			>
			<CreateOrEdit
				v-if="dialogVisible"
				@cancel="dialogVisible = false"
				@success="onSuccess"
				:role-id='roleId'
				:isEdit='isEdit'
			/>
		</el-dialog>
 </div>
</template>

<script type="ts">
import Vue from 'vue'
import { getRolePages, deleteRole } from '@/services/role'
import dayjs from 'dayjs'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
	name: 'RoleList',
	data () {
		return {
			roles: [],
			form: {
				current: 1,
				size: 50,
				name: ''
			},
			dialogVisible: false,
			isLoading: false,
			roleId: null,
			isEdit: false
		}
	},
	created () {
		this.getRolePagesList()
	},
	methods: {
		async getRolePagesList () {
			this.isLoading = true
			const { data } = await getRolePages(this.form)
			this.roles = data.data.records
			this.isLoading = false
		},
		dayDataformat (date) {
			return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
		},
		onSubmit () {
			this.getRolePagesList()
		},
		onReset () {
			this.form.name = ''
			this.getRolePagesList()
		},
		handleEdit (id) {
			this.dialogVisible = true
			this.roleId = id
			this.isEdit = true
		},
		async handleDelete (id) {
			const { data } = await deleteRole(id)
			if (data.code === '000000') {
				this.getRolePagesList()
			}
		},
		addRole () {
			this.dialogVisible = true
			this.isEdit = false
		},
		onSuccess () {
			this.dialogVisible = false
			this.getRolePagesList()
		}
	},
	components: {
		CreateOrEdit
	}
})
</script>

<style scoped lang="scss">
</style>
