<template>
    <div class="header-bar">
        <div class="header__box--unLogin f-clear">
            <span class="box--unLogin__version">{{version}}</span>
            <el-dropdown v-if="hasLogin" trigger="hover" class="fr">
                <el-button type="text" class="setting__username">
                    {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">{{$t('components_header_login_logout_text')}}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button v-else type="primary" class="box--unLogin__btn" @click="$router.push('/login')">{{$t('components_header_login_login_text')}}</el-button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'HeaderLogin',
  data () {
    return {
      version: this.$t('components_header_login_version'),
      userName: this.$store.state.userInfo && JSON.parse(this.$store.state.userInfo).username,
      hasLogin: this.$store.state.userInfo
    }
  },
  methods: {
    logout () {
      this.$confirm(this.$t('components_header_login_logout_confirm_text'), this.$t('components_header_login_logout_confirm_certain'), {
        customClass: 'delete-message',
        center: true
      }).then(() => {
        this.$store.dispatch('handleLogout').then(() => {
          this.$message.success(this.$t('components_header_login_logout_confirm_success'))
          this.$router.push('/login')
        })
      })
    }
  }
}
</script>

<style lang="scss">
    .header-bar {
        width: 100%;
        height: 60px;
        background: #fff;
        line-height: 60px;
    }
    .header__box--unLogin{
        height: 100%;
        width: 100%;
        padding: 0 120px;
        box-sizing: border-box;
        box-shadow: 0 5px 10px -5px #ddd;
        .box--unLogin__version{
            font-size: 22px;
            color: #303133;
            float: left;
        }
        .box--unLogin__btn{
            float: right;
            display: inline-block;
            width: 82px;
            height: 38px;
            margin: 12px 0;
            background: #208EF2;
            border-radius: 2px;
        }
    }
    .el-dropdown{
        line-height: 60px;
        height: 60px;
        cursor: pointer;
    }
</style>
