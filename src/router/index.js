import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/showpage', component: () => import('@/views/showpage/index') },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashBoard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页' }
    }]
  },
  {
    path: '/baseinfo',
    component: Layout,
    name: 'baseInfo',
    meta: {
      title: '基本信息管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'vehicleinfo',
        component: () => import('@/views/vehicleinfo/index'),
        name: 'vehicleInfo',
        meta: { title: '车辆信息管理' }
      },
      {
        path: 'driverinfo',
        name: 'driverInfo',
        component: () => import('@/views/driverinfo/index'),
        meta: { title: '驾驶员信息管理' }
      },
      {
        path: 'equipmentinfo',
        name: 'equipmentInfo',
        component: () => import('@/views/equipmentInfo/index'),
        meta: { title: '车载设备管理' }
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: () => import('@/views/maintenance/index'),
        meta: { title: '维修保养' }
      },
      {
        path: 'illegal',
        name: 'illegal',
        component: () => import('@/views/illegal/index'),
        meta: { title: '车辆违章' }
      },
      {
        path: 'accident',
        name: 'accident',
        component: () => import('@/views/accident/index'),
        meta: { title: '事故信息' }
      },
      {
        path: 'fuelcard',
        name: 'fuelcard',
        component: () => import('@/views/fuelcard/index'),
        meta: { title: '加油卡信息' }
      },
      {
        path: 'etc',
        name: 'etc',
        component: () => import('@/views/etc/index'),
        meta: { title: 'ETC卡信息' }
      },
      {
        path: 'oilrecord',
        name: 'oilrecord',
        component: () => import('@/views/oilrecord/index'),
        meta: { title: '加油记录' }
      },
      {
        path: 'tolls',
        name: 'tolls',
        component: () => import('@/views/tolls/index'),
        meta: { title: '过路费信息' }
      },
      {
        path: 'returnteam',
        name: 'returnteam',
        component: () => import('@/views/returnteam/index'),
        meta: { title: '归队记录' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: '调度管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'toorder',
        component: () => import('@/views/vehicleorder/index'),
        name: 'toorder',
        meta: { title: '车辆调度' }
      },
      {
        path: 'returnregistration',
        name: 'returnRegistration',
        component: () => import('@/views/returnRegistration/index'),
        meta: { title: '归队登记' }
      },
      {
        path: 'orderhistory',
        name: 'orderHistory',
        component: () => import('@/views/vehicleorderhistory/index'),
        meta: { title: '历史调度' }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'monitor',
    meta: {
      title: '监控中心',
      icon: 'nested'
    },
    children: [
      {
        path: 'constans',
        component: () => import('@/views/constans/index'),
        name: 'constans',
        meta: { title: '实时监控' }
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/views/analysis/index'),
        meta: { title: '轨迹分析' }
      },
      {
        path: 'area',
        name: 'area',
        component: () => import('@/views/area/index'),
        meta: { title: '区域管理' }
      },
      {
        path: 'threshold',
        name: 'threshold',
        component: () => import('@/views/threshold/index'),
        meta: { title: '点位离线阈值配置' }
      },
      {
        path: 'guard',
        name: 'guard',
        component: () => import('@/views/guard/index'),
        meta: { title: '点位防盗时间配置' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      title: '系统配置管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/accountmanage/index'),
        name: 'account',
        meta: { title: '账号管理' }
      },
      {
        path: 'filterrule',
        name: 'filterrule',
        component: () => import('@/views/filterrule/index'),
        meta: { title: '系统过滤规则' }
      }
    ]
  },
  {
    path: '/statistical',
    component: Layout,
    name: 'statistical',
    meta: {
      title: '统计分析',
      icon: 'nested'
    },
    children: [
      {
        path: 'mileagestatistics',
        component: () => import('@/views/statisticals/mileagestatistics/index'),
        name: 'mileagestatistics',
        meta: { title: '里程统计' }
      },
      {
        path: 'speedstatistics',
        component: () => import('@/views/statisticals/speedstatistics/index'),
        name: 'speedstatistics',
        meta: { title: '超速统计' }
      },
      {
        path: 'warnstatistics',
        component: () => import('@/views/statisticals/warnstatistics/index'),
        name: 'warnstatistics',
        meta: { title: '报警信息统计' }
      },
      {
        path: 'accidentstatistics',
        component: () => import('@/views/statisticals/accident/index'),
        name: 'accidentstatistics',
        meta: { title: '事故违章统计' }
      },
      {
        path: 'vehiclestatistics',
        component: () => import('@/views/statisticals/vehiclestatistics/index'),
        name: 'vehiclestatistics',
        meta: { title: '无单违规用车' }
      },
      {
        path: 'oilrecordstatistics',
        component: () => import('@/views/statisticals/oilrecordstatistics/index'),
        name: 'oilrecordstatistics',
        meta: { title: '加油统计' }
      },
      {
        path: 'peccancystatistics',
        component: () => import('@/views/statisticals/peccancy/index'),
        name: 'peccancystatistics',
        meta: { title: '违章统计' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/warning',
    name: 'warning',
    children: [{
      path: 'warning',
      component: () => import('@/views/warning/index'),
      meta: { title: '报警信息' }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
