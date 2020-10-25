<template>
  <div class="login">
    <!-- :model="ruleForm"
         :rules="rules"
         ref="ruleForm"
         绑定prop规则
         -->
    <el-form
      class='login-form'
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="isLoginLoading"
          @click="onSubmit">
          登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import request from '@/utils/request'
import qs from 'qs'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'Login',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 1 表单验证 ts转换form类型
        await (this.$refs.form as Form).validate()
        this.isLoginLoading = true
        // 2 验证通富哦 -> 提交表单
        const { data } = await login(this.form)
        // const { data } = await request({
        //   method: 'POST',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //   data: qs.stringify(this.form) // axiox 默认 application/json格式
        // })
        // 3 处理请求结果
        if (data.state !== 1) {
          //   失败： 给出提示
          this.$message.error(data.message)
        } else {
          // 1、登陆成功，记录登陆状态，状态需要能够全局访问（放到 vuex 容器中）
          this.$store.commit('setUser', data.content)
          // 2、然后在访问需要登录页面的时候判断有没有登陆状态（路由拦截器）
          //   成功 ： 跳转手也
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({
          //   name: 'home'
          // })
        }
      } catch (err) {
        console.log('登陆失败', err)
      }
      // 无论成功或者失败  都把loading设置为false
      this.isLoginLoading = false
    }
  }

})
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form {
      width: 300px;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
    }
    .login-btn {
      width: 100%;
    }
  }
</style>
