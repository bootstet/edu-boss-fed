<template>
	<div class="page">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<el-form ref="form" :inline="true" class="demo-form-inline">
					<el-form-item prop="courseName" label="课程名称">
						<el-input clearable v-model="courseName" placeholder="手机号"></el-input>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="status" placeholder="请选择">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button
							@click="onSubmit"
							:disabled="isLoading"
						>查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button
							@click="creatCourse"
						>+新建课程</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table
				:data="courseList"
				style="width: 100%">
				<el-table-column
					prop="id"
					label="ID"
					>
				</el-table-column>
				<el-table-column
					prop="courseName"
					label="课程名称"
					>
				</el-table-column>
				<el-table-column
					prop="price"
					label="价格">
					<template slot-scope="scope">
						<span>￥{{scope.row.price}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="sortNum"
					label="排序">
				</el-table-column>
				<el-table-column
					label="状态">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.status"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="0"
							@change="onStateChange(scope.row)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column
					prop="address"
					label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="slodOut(scope.row)">下架</el-button>
						<el-button size="mini">编辑</el-button>
						<el-button size="mini">内容管理</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script type="ts">
import Vue from 'vue'
import { getQueryCourses, changeState } from '@/services/course.ts'

export default Vue.extend({
	name: 'CourseList',
	data () {
		return {
			courseList: [],
			form: {
				phone: ''
			},
			isLoading: false,
			options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '上架'
        }, {
					value: '0',
					label: '下架'
				}],
			status: '',
			courseName: ''
		}
	},
	created () {
		this.getQueryList()
	},
	methods: {
		async getQueryList () {
			const params = {
				courseName: this.courseName,
				status: this.status,
				currentPage: 1,
				pageSize: 200
			}
			if (params.courseName === '') delete params.courseName
			if (params.status === '') delete params.status
			const { data } = await getQueryCourses(params)
			this.courseList = data.data.records
		},
		onSubmit () {
			this.getQueryList()
		},
		creatCourse () {
			console.log('creat')
			this.$router.push({
				name: 'courseCreate'
			})
		},
		async onStateChange (value) {
			const { data } = await changeState({
				courseId: value.id,
				status: value.status
			})
			console.log(data)
		}
	},
	components: {
	}
})
</script>

<style scoped lang="scss">
</style>
