<template>
  <el-form ref="form" :model="form" class="from" :rules="rules">
    <el-form-item :label="$t('main_new_password_secret_passwordQuestionType_label')" prop="passwordQuestionType">
      <el-select v-model="form.passwordQuestionType" :placeholder="$t('common_placeholder')" style="width: 100%" clearable v-leftClear>
        <el-option
          v-for="item in questionList"
          :key="item.type"
          :label="item.text"
          :value="item.type"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="passwordQuestionAnswer">
      <el-input v-model.trim="form.passwordQuestionAnswer" placeholder="" clearable @keyup.enter.native="nextStep"></el-input>
    </el-form-item>
    <el-button type="primary" @click="nextStep" class="btn-next">{{$t('main_new_password_secret_button_text')}}</el-button>
  </el-form>
</template>

<script>
import { firstSetPwd } from '@/api/main'
import { secretList } from '@/libs/constant'
export default {
  name: 'progress1',
  data () {
    return {
      preStepParams: {
        userName: '',
        salt: '',
        newPassword: ''
      },
      form: {
        passwordQuestionType: '',
        passwordQuestionAnswer: ''
      },
      questionList: secretList,
      rules: {
        passwordQuestionType: [{ required: true, message: this.$t('main_new_password_secret_rules_passwordQuestionType'), trigger: 'change' }],
        passwordQuestionAnswer: [{ required: true, message: this.$t('main_new_password_secret_rules_passwordQuestionAnswer'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    nextStep () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form, this.preStepParams)
          firstSetPwd(params).then(res => {
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
