import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui' // 编码方式进行加载
import router from '@/router'
import qs from 'qs'

const request = axios.create({
	// 配置选项
})

function redirectLogin () {
	router.push({
		name: 'login',
		query: {
			redirect: router.currentRoute.fullPath
		}
	})
}

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
	// Do something before request is sent
	// 在这里通过改写config 配置信息来实现业务功能的统一处理
	const { user } = store.state
	if (user && user.access_token) {
		config.headers.Authorization = user.access_token
	}

	// 注意： 这里一定要返回 config ，否则请求就发不出去了
	return config
}, function (error) {
	// Do something with request error
	return Promise.reject(error)
})

// 相应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	// 如果是自定义错误状态码，错误处理就写到这里
	// console.log('success', response)
	return response
}, async function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	// 如果是使用的 HTTP 状态码，错误处理放在这里
	// console.dir('error', error)
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		const { status } = error.response
		if (status === 400) {
			Message.error('请求参数错误')
		} else if (status === 401) {
			// token 无效（没有提供 token、token 是无效的、token过期了）
			// 如果有 refresh_token 则尝试使用 refresh_token 获取新的 access_token
			if (!store.state.user) {
				redirectLogin()
				return Promise.reject(error)
			}
			// 尝试获取新的 token
			try {
				const { data } = await axios.create()({
					method: 'POST',
					url: '/front/user/refresh_token',
					data: qs.stringify({
						refreshtoken: store.state.user.refresh_token
					})
				})
				// 成功了 -> 把本地失败的请求重新发出去
				console.log(error.config)
				store.commit('setUser', data.content)
				return request(error.config)
				// 把成功刷新的token更新到容器中和本地中
			} catch (err) {
				// 把当前用户状态清除
				store.commit('setUser', null)
				// 失败了 -> 跳转登陆页面获取新的 token
				redirectLogin()
				return Promise.reject(error)
			}
			// 如果没有直接跳转登陆页
		} else if (status === 403) {
			Message.error('没有权限、请联系管理员')
		} else if (status === 404) {
			Message.error('请求资源不存在')
		} else if (status >= 500) {
			Message.error('服务端错误，请联系管理员')
		}
		// 400
		// 401
		// 403
		// 404
		// 500
	} else if (error.request) {
		// The request was made but no response was received
		// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
		// http.ClientRequest in node.js
		Message.error('请求超时，请刷新重试')
	} else {
		// Something happened in setting up the request that triggered an Error
		Message.error(`请求失败${error.message}`)
	}
	// 错误继续抛出，扔给下一个上一个调用者
	return Promise.reject(error)
})

export default request
