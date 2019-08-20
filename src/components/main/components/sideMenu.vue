<template>
  <div>
    <slot></slot>
    <div class="side-menu">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group> -->

      <el-menu :default-active="defaultActive" class="el-menu-vertical" :collapse="isCollapse" router>
        <template v-for="item in menuList">
          <!-- 一级菜单 -->
          <el-submenu :index="`/${item.name}`" v-if="item.children && item.children.length">
            <template slot="title">
              <i class="iconfont" :class="item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </template>
            <el-menu-item-group v-for="subItem in item.children" :key="subItem.name">
              <template v-if="subItem.children && subItem.children.length">
                <el-submenu :index="`/${item.name}/${subItem.name}`" v-for="subMenuItem in subItem.children" :key="subMenuItem.name">
                  <span slot="title">{{subItem.meta.title}}</span>
                  <!-- 三级菜单 -->
                  <el-menu-item :index="`/${item.name}/${subItem.name}/${subMenuItem.name}`">{{subMenuItem.meta.title}}</el-menu-item>
                </el-submenu>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item class="menu-title" :index="`/${item.name}/${subItem.name}`" v-else>{{subItem.meta.title}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item :index="`/${item.name}`" v-else>
            <i class="iconfont" :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sideMenu',
  data () {
    return {
      isCollapse: false
    }
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    defaultActive () {
      return this.$route.redirectedFrom || this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu/deep/{
  .el-submenu .el-submenu__title,
  .el-menu-item{
    height: 54px;
    background: #22313d;
    font-size: 14px;
    color: rgba(255,255,255,0.50);
  }
  .el-submenu .el-submenu__title:hover,
  .el-menu-item:hover{
    background: #1d2b35;
    color: #fff;
    .iconfont{
      color: #fff;
    }
  }
  .el-menu-item-group__title{
    padding: 0;
  }
  .el-menu-item.is-active{
    background: #1d2b35;
    color: #fff;
  }
  .el-menu-item>span,
  .el-submenu__title>span{
    margin-left: 10px;
  }
  .menu-title{
    padding-left: 45px!important;
    height: 40px;
    line-height: 40px;
  }
}
</style>
