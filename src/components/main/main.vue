<template>
  <div>
    <el-container>
      <el-header style="padding: 0">
        <header-bar></header-bar>
      </el-header>
      <el-container style="height: calc(100vh - 60px)">
        <el-aside width="200px" style="height: 100%;background: #22313d;overflow: hidden;">
          <el-scrollbar class="menu__scroll">
            <side-menu :menu-list="menuList">
            </side-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HeaderBar from './components/headerBar'
import SideMenu from './components/sideMenu'

export default {
  name: 'main1',
  components: {
    HeaderBar,
    SideMenu
  },
  computed: {
    menuList () {
      return this.$store.getters.menuList
    }
  },
  created () {
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.menu__scroll/deep/{
  height: calc(100vh - 60px);
  .el-scrollbar__wrap{
    overflow-x: hidden;
    width: 100%;
    padding-right: 20px;
  }
}
.menu{
  padding: 20px 0 10px 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.50);
}
</style>
