<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">修改密码</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="reset__box">
      <el-tab-pane label="修改密码" name="password">
        <password ref="password" />
      </el-tab-pane>
      <el-tab-pane label="修改密保" name="secret">
        <secret ref="secret" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import password from './components/password'
import secret from './components/secret'
export default {
  name: 'index',
  components: {
    password,
    secret
  },
  data () {
    return {
      activeName: 'password'
    }
  },
  methods: {
    handleClick () {
      this.$refs.password.$refs.form.resetFields()
      this.$refs.secret.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-tabs__header {
    margin-bottom: 22px;
  }
  .el-tabs__item{
    font-size: 16px;
  }
}
.reset__box {
  background-color: #fff;
  width: 100%;
  padding: 10px 20px 0 20px;
  height: calc(100vh - 140px);
  min-height: 450px;
  box-sizing: border-box;
}
</style>
