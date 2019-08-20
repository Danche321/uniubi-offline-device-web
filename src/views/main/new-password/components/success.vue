<template>
  <div class="from">
    <i class="iconfont icon-success"></i>
    <p class="success__text">新密码设置成功</p>
    <el-button type="primary" @click="$router.push('/login')" class="btn-next">登录页面（{{second}}s）</el-button>
  </div>
</template>

<script>
export default {
  name: 'progress3',
  data () {
    return {
      second: 3,
      timer: null
    }
  },
  created () {
    this.cutSecond()
  },
  methods: {
    cutSecond () {
      this.timer = setInterval(() => {
        if (this.second > 0) {
          this.second--
        } else {
          clearInterval(this.timer)
          this.$router.push('/login')
        }
      }, 1000)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
  .icon-success {
    width: 100px;
    height: 100px;
    color: #3fc948;
    font-size: 100px;
  }
  .success__text {
    font-size: 20px;
    color: #303133;
    margin: 30px 0 20px 0;
  }
</style>
