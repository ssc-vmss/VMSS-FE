<template>
  <section>
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
    </transition>
  </section>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 70px);
  position: relative;
  /* overflow: hidden; */
}
</style>
