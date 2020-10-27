<template>
 <div class="resource-list">
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<el-form ref="form" :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item prop="name" label="资源名称">
					<el-input v-model="formInline.name" placeholder="资源名称"></el-input>
				</el-form-item>
				<el-form-item prop="url" label="资源路径">
					<el-input v-model="formInline.url" placeholder="资源路径"></el-input>
				</el-form-item>
				<el-form-item porp="categoryId" label="资源分类">
					<el-select
						clearable
						v-model="formInline.categoryId"
						placeholder="资源分类">
						<el-option
						:label="item.name"
						:value="item.id"
						v-for="item in resourceCategories"
						:key="item.id"
						></el-option>
					</el-select>
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
		<el-table
			v-loading="isLoading"
			:data="resourceData"
			style="width: 100%;margin-bottom: 20px">
			<el-table-column
				type="index"
				label="编号"
				width="100">
			</el-table-column>
			<el-table-column
				prop="name"
				label="资源名称"
				width="180">
			</el-table-column>
			<el-table-column
				prop="url"
				label="资源路径">
			</el-table-column>
			<el-table-column
				prop="description"
				label="描述">
			</el-table-column>
			<el-table-column
				prop="createdTime"
				label="添加时间">
			</el-table-column>
			<el-table-column
				prop="description"
				label="操作">
			</el-table-column>
		</el-table>

    <el-pagination
			:disabled="isLoading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="formInline.current"
      :page-sizes="[5, 10, 20]"
      :page-size="formInline.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totleCount">
    </el-pagination>

	</el-card>
 </div>
</template>

<script type="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

export default Vue.extend({
	data () {
		return {
			resourceData: [],
			formInline: {
				name: '',
				url: '',
				current: 1,
				size: 5,
				categoryId: null // 资源分类
			},
			currentPage4: 4,
			totleCount: 0,
			resourceCategories: [], // 资源分类列表
			isLoading: true
		}
	},
	created () {
		this.loadResources()
		this.loadResourceCategories()
	},
	methods: {
		async loadResourceCategories () {
			const { data } = await getResourceCategories()
			console.log(data)
			this.resourceCategories = data.data
		},
		async loadResources () {
			this.isLoading = true
			const { data } = await getResourcePages(this.formInline)
			this.resourceData = data.data.records
			this.totleCount = data.data.total
			this.isLoading = false
		},
		onSubmit () {
			this.formInline.current = 1
			this.loadResources()
		},
		handleSizeChange (val) {
			this.formInline.size = val
			this.formInline.current = 1
			this.loadResources()
		},
		handleCurrentChange (val) {
			this.formInline.current = val
			this.loadResources()
		},
		onReset () {
			this.$refs.form.resetFields()
			this.formInline.current = 1
			this.loadResources()
		}
	}
})
</script>

<style scoped lang="scss">
</style>
