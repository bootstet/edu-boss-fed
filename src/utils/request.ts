import axios from 'axios'
import store from '@/store'

const request = axios.create({
	// 配置选项
})

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

export default request
