<template>
	<div class="page">
		<el-card>
			<div class="clearfix">
				<el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
					<el-form-item prop="phone" label="手机号">
						<el-input clearable v-model="form.phone" placeholder="手机号"></el-input>
					</el-form-item>
					<el-date-picker
						v-model="userTime"
						type="daterange"
						align="right"
						clearable
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:picker-options="pickerOptions">
					</el-date-picker>
					<!-- <el-form-item prop="name" label="注册时间">
						<el-input v-model="form.name" placeholder="注册时间"></el-input>
					</el-form-item> -->
					<el-form-item>
						<el-button
							@click="onSubmit"
							:disabled="isLoading"
						>查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-card  class="box-card">
			<el-table
				:data="roles"
				style="width: 100%">
				<el-table-column
					prop="id"
					label="用户ID"
					>
				</el-table-column>
				<el-table-column
					label="头像"
					>
					<template slot-scope="scope">
						<div>
							<el-avatar size="small" :src="scope.row.portrait|| require('@/assets/default-avatar.png')"></el-avatar>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="name"
					label="用户名"
					>
				</el-table-column>
				<el-table-column
					prop="phone"
					label="手机号"
					>
				</el-table-column>
				<el-table-column
					label="注册时间"
					>
					<template slot-scope="scope">
						<div>{{ dayDataformat(scope.row.createdTime) }}</div>
					</template>
				</el-table-column>
				<el-table-column
					prop="status"
					label="状态"
					>
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
								@click="assignRole(scope.row.id)"
								size="mini"
								>分配角色</el-button>
							<el-button
								type="text"
								@click="handleDelete(scope.row.id)"
								size='mini'
								>禁用</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog
				title="分配角色"
				:visible.sync="dialogVisible"
				width="30%"
				>
				<el-select v-model="roleIdList" multiple placeholder="请选择">
					<el-option
						v-for="item in rolesOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="handleAllocRole">确 定</el-button>
				</span>
			</el-dialog>
		</el-card>
		<el-pagination
			:disabled="isLoading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="form.currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totleCount">
    </el-pagination>
 </div>
</template>

<script type="ts">
import Vue from 'vue'
import { deleteRole, getAllRoles, allocateRole, getUserRoles } from '@/services/role'
import { getUserPages } from '@/services/user'
import dayjs from 'dayjs'

export default Vue.extend({
	name: 'UserList',
	data () {
		return {
			roles: [],
			form: {
				currentPage: 1,
				pageSize: 10,
				phone: '',
				userId: ''
			},
			userTime: '',
			dialogVisible: false,
			isLoading: false,
			roleId: null,
			totleCount: 0,
			rolesOptions: [],
			roleIdList: [],
			currentUser: null, // 分配角色的当前用户
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick (picker) {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
						picker.$emit('pick', [start, end])
					}
				}, {
					text: '最近一个月',
					onClick (picker) {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
						picker.$emit('pick', [start, end])
					}
				}, {
					text: '最近三个月',
					onClick (picker) {
						const end = new Date()
						const start = new Date()
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
						picker.$emit('pick', [start, end])
					}
				}]
			}
		}
	},
	created () {
		this.getUserPageList()
	},
	methods: {
		async getUserPageList () {
			this.isLoading = true
			const { data } = await getUserPages(this.form)
			this.roles = data.data.records
			this.totleCount = data.data.total
			this.isLoading = false
		},
		dayDataformat (date) {
			return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
		},
		onSubmit () {
			console.log(this.userTime)
			if (this.userTime) {
				this.form.startCreateTime = this.userTime[0]
				this.form.endCreateTime = this.userTime[1]
			} else {
				delete this.form.startCreateTime
				delete this.form.endCreateTime
			}
			this.getUserPageList()
		},
		assignRole (role) {
			this.dialogVisible = true
			this.currentUser = role
			this.handleSelectRole()
		},
		handleEdit (id) {
			this.dialogVisible = true
			this.roleId = id
		},
		async handleDelete (id) {
			const { data } = await deleteRole(id)
			if (data.code === '000000') {
				this.getUserPageList()
			}

			const { data: { data: userRoles } } = await getUserRoles(id)
			this.roleIdList = userRoles.map((item) => item.id)
		},
		onSuccess () {
			this.dialogVisible = false
			this.getUserPageList()
		},
		handleSizeChange (val) {
			this.form.pageSize = val
			this.form.currentPage = 1
			this.getUserPageList()
		},
		handleCurrentChange (val) {
			this.form.currentPage = val
			this.getUserPageList()
		},
		async handleSelectRole () {
			const { data } = await getAllRoles()
			console.log(data)
			this.rolesOptions = data.data
		},
		async handleAllocRole () {
			const { data } = await allocateRole({
				userId: this.currentUser,
				roleIdList: this.roleIdList
			})
			this.$message.success('操作成功')
			console.log(data)
		}
	}
})
</script>

<style scoped lang="scss">
</style>
