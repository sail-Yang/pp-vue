import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/signup',
    component: () => import('@/views/signup/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: '/index',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },

  {
    path: '/datashow',
    component: Layout,
    redirect: '/',
    alwaysShow: true,
    name: '数据展示',
    meta: {
      title: '数据展示',
      icon: 'international'
    },
    children: [
      {
        path: 'humidity',
        name: 'Humidity',
        component: () => import('@/views/weather/humidity/index'),
        meta: { title: '湿度', icon: 'tree-table', noCache: true }
      },
      {
        path: 'pressure',
        name: 'Pressure',
        component: () => import('@/views/weather/pressure/index'),
        meta: { title: '压力', icon: 'tree-table', noCache: true }
      },
      {
        path: 'temperature',
        name: 'Temperature',
        component: () => import('@/views/weather/temperature/index'),
        meta: { title: '温度', icon: 'tree-table', noCache: true }
      },
      {
        path: 'wind',
        name: 'Wind',
        component: () => import('@/views/weather/wind/index'),
        meta: { title: '风速', icon: 'tree-table', noCache: true }
      },
      {
        path: 'direction',
        name: 'Direction',
        component: () => import('@/views/weather/direction/index'),
        meta: { title: '风向', icon: 'tree-table', noCache: true }
      }
    ]
  },
  {
    path: '/predict',
    component: Layout,
    redirect: '/',
    alwaysShow: true,
    name: '功率预测',
    meta: {
      title: '功率预测',
      icon: 'chart'
    },
    children: [
      {
        path: 'realtime',
        name: 'Realtime',
        component: () => import('@/views/realtime/index'),
        meta: { title: '实时功率预测', icon: 'table' }
      },
      {
        path: 'period',
        name: 'Short',
        component: () => import('@/views/shortpredict/index'),
        meta: { title: '自定义功率预测', icon: 'example' }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/log',
    component: Layout,
    redirect: '/log/outlier',
    alwaysShow: true,
    meta: {
      title: '日志',
      icon: 'bug',
      roles: ['admin', 'user']
    },
    children: [
      {
        path: 'outlier',
        name: 'Log',
        component: () => import('@/views/log/outlier/index'),
        meta: { title: '预警日志', icon: 'bug' }
      },
      {
        path: 'fix',
        name: 'Log',
        component: () => import('@/views/log/fix/index'),
        meta: { title: '维修日志', icon: 'bug', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/index',
    children: [
      {
        path: 'index',
        name: 'Settings',
        component: () => import('@/views/settings/index'),
        meta: { title: '设置', icon: 'user' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
