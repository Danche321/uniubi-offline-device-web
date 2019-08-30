<template>
  <el-form ref="form" :model="form" class="from" :rules="rules">
    <el-form-item :label="$t('main_lost_password_password_password1_label')" prop="password1">
      <el-input v-model.trim="form.password1" :type="showPass1 ? 'text' : 'password'">
        <i slot="suffix" class="iconfont" :class="showPass1 ? 'icon-hide' : 'icon-hide'" @click.stop="showPass1 = !showPass1"></i>
      </el-input>
      <p>{{$t('main_lost_password_password_password1_tip')}}</p>
    </el-form-item>
    <el-form-item :label="$t('main_lost_password_password_password1_label')" prop="password2">
      <el-input v-model.trim="form.password2" :type="showPass2 ? 'text' : 'password'" @keyup.enter.native="nextStep">
        <i slot="suffix" class="iconfont" :class="showPass2 ? 'icon-hide' : 'icon-hide'" @click.stop="showPass2 = !showPass2"></i>
      </el-input>
    </el-form-item>
    <el-button type="primary" @click="nextStep" class="btn-next">{{$t('main_lost_password_password_button_text')}}</el-button>
  </el-form>
</template>

<script>
import { passwordRule, passwordAgainRule } from '@/libs/rules'
import { getRandomStr, hashPassWord } from '@/libs/util'
import { resetPwd } from '@/api/main'
export default {
  name: 'progress2',
  data () {
    const psw2Validate = (rule, value, callback) => {
      passwordAgainRule(rule, value, callback, this.form.password1)
    }
    return {
      preStepParams: {
        passwordQuestionType: '',
        passwordQuestionAnswer: ''
      },
      form: {
        password1: '',
        password2: ''
      },
      rules: {
        password1: [{ validator: passwordRule, trigger: 'blur' }],
        password2: [{ validator: psw2Validate, trigger: 'blur' }]
      },
      showPass1: false,
      showPass2: false
    }
  },
  methods: {
    nextStep () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const newSalt = getRandomStr()
          const currentParams = {
            name: 'Admin',
            newPassword: hashPassWord(this.form.password1, newSalt),
            salt: newSalt
          }
          const params = Object.assign({}, this.preStepParams, currentParams)
          resetPwd(params).then(res => {
            if (res.success) {
              this.$emit('nextStep')
            }
          })
        }
      })
    }
  }
}
</script>
