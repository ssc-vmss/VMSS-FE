<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="itemMenu.length>0" ref="sidebar" class="sidebar-container">
      <ul class="sidebar-ul">
        <li v-for="(item,index) in itemMenu" v-if="item.path!=='warning'" :key="index" :class="{active:itemMenuIndex == index}" @click="handleClickItemMenu(index)" @mouseover="showInfoIndex = index" @mouseout="showInfoIndex = -1">
          <router-link :to="resolvePath(menuPath+'/'+item.path)">
            <img :src="require('@/assets/icons/'+item.name+'.png')" :title="item.meta.title" />
            <div v-if="showInfoIndex == index" class="img-info">{{ item.meta.title }}</div>
            <!-- <div class="img-info">{{ item.meta.title }}</div> -->
          </router-link>
          <!-- <div v-if="showInfoIndex == index" class="img-info">{{ item.meta.title }}</div> -->
        </li>
      </ul>
      <ul>
        <li :class="{active:itemMenuIndex == itemMenu.length + 1}" class="warning-box" @click="handleClickItemMenu(itemMenu.length + 1)" @mouseover="showWarningInfo = true" @mouseout="showWarningInfo = false">
          <router-link :to="resolvePath('/warning')">
            <img :src="require('@/assets/icons/warning.png')" title="报警信息" />
          </router-link>
          <div v-if="showWarningInfo" class="img-info">报警信息</div>
        </li>
      </ul>
    </div>
    <div class="main-container">
      <el-menu class="navbar-container" mode="horizontal">
        <div class="logo" @click="handleClicLogo">
          <router-link :to="resolvePath('dashboard')">
            <img class="logo-img" :src="require('@/assets/icons/logo.png')" title="首页" />
            <span class="logo-span">车辆调度管理系统</span>
          </router-link>
        </div>
        <div ref="navmenu" class="navmenu-container">
          <div :default-active="$route.path" class="navmenu-box">
            <ul>
              <li v-for="(route,index) in routes" v-if="route.meta&&route.meta.title" :class="{active:menuIndex == index}" :key="route.name" :index="resolvePath(route.path)" @click="handleClickMenu(route,index)">
                <span slot="title" class="navmenu-item">
                  <router-link :to="resolvePath(route.path+'/'+route.children[0].path)">
                    {{ route.meta.title }}
                  </router-link>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="exitButton">
          <button class="btn" @click="logout">退出</button>
        </div>
      </el-menu>
      <!-- <breadcrumb @handleClicLogo="handleClicLogo"/> -->
      <app-main />
      <el-footer style="height:20px">Copyright © 2018 VMSS.</el-footer>
    </div>
  </div>
</template>

<script>
import path from 'path'
import Breadcrumb from '@/components/Breadcrumb'
import { AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Breadcrumb, AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      menuPath: '',
      menuIndex: 0,
      itemMenu: [],
      itemMenuIndex: 0,
      showInfoIndex: -1,
      showWarningInfo: false
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    routes() {
      return this.$router.options.routes
    }
  },
  created() {
    // console.log(this.routes)
  },
  mounted() {
    this.getSessionStorage()
  },
  methods: {
    // 获取SessionStorage数据
    getSessionStorage() {
      if (sessionStorage.length > 0) {
        this.menuPath = sessionStorage.menuPath.replace(/\"/g, '')
        this.menuIndex = sessionStorage.menuIndex
        this.itemMenu = JSON.parse(sessionStorage.itemMenu)
        this.itemMenuIndex = sessionStorage.itemMenuIndex
      }
    },
    // 缓存SessionStorage数据
    setSessionStorage() {
      sessionStorage.menuPath = JSON.stringify(this.menuPath)
      sessionStorage.menuIndex = this.menuIndex
      sessionStorage.itemMenu = JSON.stringify(this.itemMenu)
      sessionStorage.itemMenuIndex = this.itemMenuIndex
    },
    // 点击Logo
    handleClicLogo() {
      this.menuIndex = -1
      this.itemMenu = []
      this.setSessionStorage()
    },
    // 点击菜单
    handleClickMenu(item, index) {
      window.clearInterval()
      this.menuIndex = index
      this.itemMenuIndex = 0
      this.itemMenu = item.children
      this.itemMenu.forEach(item => {
        item.name = item.name.toLowerCase()
      })
      this.menuPath = item.path
      this.setSessionStorage()
    },
    // 点击子菜单
    handleClickItemMenu(index) {
      window.clearInterval()
      this.itemMenuIndex = index
      this.setSessionStorage()
    },
    resolvePath(...paths) {
      return path.resolve(...paths)
    },
    // 点击退出
    logout() {
      sessionStorage.clear()
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
%section {
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-thumb {
    background-color: rgba(136, 136, 136, 0.5);
    border-radius: 20px;
    z-index: 999;
  }
  &::-webkit-scrollbar {
    height: 10px;
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 20px;
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .sidebar-ul {
    @extend %section;
  }
}
.drawer-bg {
  background-color: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.navbar-container {
  background-color: rgba(0, 128, 128, 1);
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  border-bottom: 1px solid #fff;
  .logo {
    display: inline-block;
    float: left;
    margin-left: 40px;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
      transition: 0.5s;
    }
    .logo-img {
      float: left;
    }
    .logo-span {
      padding: 15px;
      font-size: 22px;
      font-weight: 700;
      color: #f5fffa;
    }
  }
  .exitButton {
    top: 0;
    right: 0;
    position: absolute;
    padding: 0 20px;
    .btn {
      border: none;
      background: transparent;
      color: #f5fffa;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    top: 0;
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .navbar-menu {
        &:hover {
          color: #1e90ff;
          font-weight: 700;
        }
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
