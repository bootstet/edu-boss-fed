import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true // 父路由配置了以后 子路由都不用配了
    },
    children: [
      {
        path: '/test-login', // test
        name: 'testlogin',
        component: () => import(/* webpackChunkName: 'login' */'@/views/login/index.vue')
      },
      {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/home/index.vue')
        // meta: {
        //   requiresAuth: true // 自定义数据
        // } // meta 默认是一个空对象
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index.vue')
        // meta: {
        //   requiresAuth: true // 自定义数据
        // } // meta 默认是一个空对象
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/menu/menu-create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/menu-create.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit.vue'),
        meta: {
          requiresAuth: true // 自定义数据
        } // meta 默认是一个空对象
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404') */'@/views/error-page/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫 ：任务页面的访问都要经过这里
// to: 要去那里的陆游信息
// from: 从哪里来的陆游信息
// next: 通行的标志
router.beforeEach((to, from, next) => {
  // 路由守卫中一定要调用 next()
  next()

  // if (to.path !== '/login') {
  //   // 校验登陆状态
  // }

  // to.matched 是一个数组 （匹配到的路由记录）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要登录状态的，校验登陆状态,如果没有的登陆状态，跳转登陆页面
    if (!store.state.user) {
      // 跳转登陆页面
      next({
        name: 'login',
        query: { // 通过 url 传递查询字符串参数
          redirect: to.fullPath // 把登陆成功需要返回的页面告诉登陆页面
        }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next()
  }
})

export default router
