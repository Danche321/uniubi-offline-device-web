<template>
  <div class="header-bar">
    <div class="header__box--hasLogin f-clear">
      <div class="header-logo">
        <img :src="logo&&`${baseUrl}/file/image/${logo}`" alt="logo" class="logo__img">
        <span class="logo__text">{{ companyName }}</span>
      </div>
      <div class="header-setting">
        <el-dropdown trigger="hover" :show-timeout="0">
          <div class="icon-setting-wrap">
            <i class="iconfont icon-Setting f-pointer"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/company')"><i class="iconfont icon-company"></i>公司信息</el-dropdown-item>
            <el-dropdown-item @click.native="$router.push('/client-setting')"><i class="iconfont icon-Client"></i>客户端设置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="icon-split"></i>
        <el-dropdown trigger="hover" :show-timeout="0">
          <div class="username-wrap">
            <span class="setting__username f-pointer">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/reset-password')"><i class="iconfont icon-change_Password"></i>修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout"><i class="iconfont icon-quit"></i>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerBar',
  data () {
    return {
      version: '客户端系统V1.0'
    }
  },
  computed: {
    companyName () {
      return this.$store.state.userInfo && JSON.parse(this.$store.state.userInfo).orgName
    },
    userName () {
      return this.$store.state.userInfo && JSON.parse(this.$store.state.userInfo).username
    },
    logo () {
      return this.$store.state.userInfo && JSON.parse(this.$store.state.userInfo).orgLogo
    }
  },
  methods: {
    logout () {
      this.$confirm('是否确认退出登录?', '退出登录？', {
        customClass: 'delete-message',
        center: true
      }).then(() => {
        this.$store.dispatch('handleLogout').then(() => {
          this.$message.success('退出成功！')
          this.$router.push('/login')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/{
    .el-dropdown-menu__item{
      height: 40px;
      line-height: 40px !important;
      .iconfont{
        margin-right: 8px;
        color:  #C0C4CC;
      }
      &:first-child{
        border-bottom: 1px solid #E4E7ED;
      }
    }
  }
  .el-dropdown{
    line-height: 60px;
    height: 60px;
    cursor: pointer;
  }
  .header-bar {
    width: 100%;
    height: 60px;
    background: #fff;
    line-height: 60px;
  }
  .header__box--hasLogin{
    height: 100%;
    padding: 0 40px 0 20px;
    box-sizing: border-box;
  }
  .header-logo{
    float: left;
    .logo__img{
      height: 36px;
    }
    .logo__text{
      font-size: 16px;
      color: #303133;
      margin-left: 16px;
    }
  }
  .header-setting{
    float: right;
    .icon-split{
      width: 1px;
      height: 14px;
      background: #E4E7ED;
      margin: 0 20px;
      display: inline-block;
    }
  }
  .setting__username{
    font-size: 14px !important;
    color: #606266 !important;
    .el-icon-arrow-down{
      color: #C0C4CC;
    }
  }
  /*.icon-setting-wrap{*/
  /*  height: 50px;*/
  /*  width: 40px;*/
  /*  text-align: center;*/
  /*  cursor: pointer;*/
  /*  margin-right: 8px;*/
  /*}*/
  /*.username-wrap{*/
  /*  height: 50px;*/
  /*  cursor: pointer;*/
  /*}*/
</style>
