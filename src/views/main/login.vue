<template>
  <div class="login">
    <p class="login__version">{{$t('main_login_version')}}</p>
    <img class="login__img" src="@/assets/images/login-bg.png" />
    <div class="login__form">
      <p class="welcome">{{$t('main_login_welcome')}}</p>
      <el-form ref="form" :model="form" label-width="0" class="login-from" :rules="rules" @keyup.enter.native="handleSubmit">
        <el-form-item prop="userName">
          <el-input v-model.trim="form.userName" :placeholder="$t('main_login_userName_placeholder')" prefix-icon="iconfont icon-Account" disabled></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model.trim="form.password" :type="showPass ? 'text' : 'password'" prefix-icon="iconfont icon-password" :placeholder="$t('main_login_password_placeholder')">
            <i slot="suffix" class="iconfont icon-hide" :class="showPass ? 'icon-display' : 'icon-mimabukejian'" @click.stop="showPass = !showPass"></i>
          </el-input>
        </el-form-item>

        <el-button type="primary" @click="handleSubmit" class="btn-login">{{$t('main_login_submit_text')}}</el-button>
      </el-form>
      <div class="login-tip">
        <router-link to="/lost-password">{{$t('main_login_lost_text')}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomStr, hashPassWord } from '@/libs/util'
import { passwordRule } from '@/libs/rules'
import { getSolt } from '@/api/main'
export default {
  name: 'login',
  data () {
    return {
      form: {
        userName: 'Admin',
        password: ''
      },
      rules: {
        password: [
          { validator: passwordRule, trigger: 'blur' }
        ]
      },
      showPass: false
    }
  },
  methods: {
    getOldSalt () {
      return new Promise((resolve, reject) => {
        getSolt(this.form.userName).then(res => {
          if (res.success) {
            resolve(res.data)
          }
        })
      })
    },
    handleSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const newSalt = getRandomStr()
          this.getOldSalt().then(oldSalt => {
            const params = {
              name: this.$store.state.username,
              newPassword: hashPassWord(this.form.password, newSalt),
              oldPassword: hashPassWord(this.form.password, oldSalt),
              salt: newSalt
            }
            this.$store.dispatch('handleLogin', params, this.form.password).then(res => {
              if (res.success) {
                const { active, orgId } = res.data
                this.$store.commit('updatePassword', require('js-base64').Base64.encode(this.form.password))
                if (!active) { // 首次登录
                  this.$router.push({ name: 'newPassword' })
                } else {
                  if (!orgId) {
                    this.$router.push({ name: 'completeCompany' })
                  } else {
                    this.$router.push('/home')
                  }
                }
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .login{
    background-image: linear-gradient(-135deg, #5C7FFF 0%, #67C7FF 100%);
    width: 100vw;
    height: 100vh;
    /deep/{
      .el-form-item__content{
        line-height: 40px;
      }
    }
  }
  .login__version{
    position: fixed;
    font-size: 22px;
    color: #FFFFFF;
    left: 80px;
    top: 63px;
  }
  .login__img{
    position: fixed;
    left: 13.8vw;
    top: 50%;
    transform: translateY(-50%);
    width: 533px;
    height: 629px;
  }
  .login__form{
    width: 420px;
    height: 422px;
    padding: 40px 50px 50px 50px;
    box-sizing: border-box;
    background: #fff;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    right: 11vw;
    box-shadow: 0 10px 30px 0 rgba(11,83,136,.3);
    border-radius: 10px;
    .el-input__prefix{
      padding-left: 8px;
      line-height: 40px;
    }
    .el-input__inner{
      padding: 0 40px;
      height: 40px;
    }
    .name{
      font-size: 24px;
      color: #303133;
      text-align: center;
    }
    .welcome{
      text-align: center;
      margin-bottom: 40px;
      font-size: 24px;
      color: #303133;
    }
    .login-tip{
      margin-top: 30px;
      text-align: center;
      a{
        color: #208EF2;
      }
    }
    .btn-login{
      background: #208EF2;
      border-radius: 2px;
      width: 320px;
      height: 46px;
      font-size: 16px;
      margin-top: 8px;
    }
    .el-input__suffix{
      right: 12px;
    }
  }
</style>
