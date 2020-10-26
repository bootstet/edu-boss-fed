/**
 * 用户相关请求模块
 */
import request from '@/utils/request'
import qs from 'qs'

interface User {
	phone: string
	password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data是普通对象，则 content-type 是 application/json
    // 如果data是 qs.stringify(data)转换之后的数据  key=value&key=value,则content-type会被设置
    // 设置为application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，则content-type 是 mulitpart/form-data
    data: qs.stringify(data) // axiox 默认 application/json格式的数据
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}
