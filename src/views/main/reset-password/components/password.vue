<template>
  <el-form ref="form" :model="form" class="form-password" :rules="rules">
    <el-form-item prop="oldPassword" label="旧密码">
      <el-input
        v-model.trim="form.oldPassword"
        autocomplete="off"
        type="password"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item prop="newPassword1" label="新密码">
      <uniubi-input
        focus-message="提示：密码由6-18位数字/字母/符号两种及以上任意组合组成"
        v-model.trim="form.newPassword1"
        type="password"
        autocomplete="off"
        clearable
      >
      </uniubi-input>
    </el-form-item>
    <el-form-item prop="newPassword2" label="重复密码">
      <el-input
        v-model.trim="form.newPassword2"
        autocomplete="off"
        type="password"
        clearable
        @keyup.enter.native="handleSubmit"
      ></el-input>
    </el-form-item>

    <el-button type="primary" @click="handleSubmit" class="btn-login mt10"
      >修改</el-button
    >
  </el-form>
</template>

<script>
import UniubiInput from '@/components/input'
import { passwordRule, passwordAgainRule } from '@/libs/rules'
import { getRandomStr, hashPassWord } from '@/libs/util'
import { updatePwd, getSolt } from '@/api/main'
export default {
  name: 'password',
  components: {
    UniubiInput
  },
  data () {
    const psw2Validate = (rule, value, callback) => {
      passwordAgainRule(rule, value, callback, this.form.newPassword1)
    }
    return {
      form: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { validator: passwordRule, trigger: 'blur' }
        ],
        newPassword1: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: passwordRule, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '请输入重复密码', trigger: 'blur' },
          { validator: psw2Validate, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getOldSalt () {
      return new Promise((resolve, reject) => {
        getSolt(this.$store.state.username).then(res => {
          if (res.success) {
            resolve(res.data)
          }
        })
      })
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const newSalt = getRandomStr()
          this.getOldSalt().then(oldSalt => {
            const params = {
              name: this.$store.state.username,
              newPassword: hashPassWord(this.form.newPassword1, newSalt),
              oldPassword: hashPassWord(this.form.oldPassword, oldSalt),
              salt: newSalt
            }
            updatePwd(params).then(res => {
              if (res.success) {
                this.$store.commit(
                  'updatePassword',
                  require('js-base64').Base64.encode(this.form.newPassword1)
                )
                this.$message.success('修改成功')
                this.$refs.form.resetFields()
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-password {
  width: 380px;
}
</style>
