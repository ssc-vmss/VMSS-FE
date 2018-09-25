<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item key="dashboard">
        <router-link :to="resolvePath('dashboard')" @click.native="handleClicLogo">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in levelList" v-if="item.meta.title" :key="item.path">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import path from 'path'
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== "dashboard") {
        matched = [{ path: "/dashboard", meta: { title: "" } }].concat(
          matched
        )
      }
      this.levelList = matched
    },
    handleClicLogo() {
      this.$emit('handleClicLogo')
    },
    resolvePath(...paths) {
      return path.resolve(...paths)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  float: left;
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  padding: 0 20px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
