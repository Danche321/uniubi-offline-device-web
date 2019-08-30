<template>
    <el-form ref="form" :model="form" class="form-box" :rules="rules">
        <p class="top-tip">{{$t('main_reset_password_secret_tip')}}</p>
        <el-form-item :label="secretQuestion" prop="oldPasswordQuestionAnswer">
            <el-input v-model.trim="form.oldPasswordQuestionAnswer" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('main_reset_password_secret_newPasswordQuestionType_label')" prop="newPasswordQuestionType">
            <el-select v-model="form.newPasswordQuestionType" :placeholder="$t('common_placeholder')" style="width: 100%" clearable v-leftClear>
                <el-option
                        v-for="item in secretList"
                        :key="item.type"
                        :label="item.text"
                        :value="item.type"
                >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="newPasswordQuestionAnswer">
            <el-input v-model.trim="form.newPasswordQuestionAnswer" clearable></el-input>
            <p class="sub-tip">{{$t('main_reset_password_secret_newPasswordQuestionAnswer_tip')}}</p>
        </el-form-item>
        <el-button type="primary" @click="handleSubmit" class="btn-login mt10">{{$t('main_reset_password_secret_submit_text')}}</el-button>
    </el-form>
</template>

<script>
import { fetchQuestion, updateSecret } from '@/api/main'
import { secretList } from '@/libs/constant'
export default {
  name: 'secret',
  data () {
    return {
      secretQuestion: '',
      secretList: secretList,
      form: {
        name: this.$store.state.username,
        oldPasswordQuestionType: '',
        oldPasswordQuestionAnswer: '',
        newPasswordQuestionType: '',
        newPasswordQuestionAnswer: ''
      },
      rules: {
        oldPasswordQuestionAnswer: [{ required: true, message: this.$t('main_reset_password_secret_rules_oldPasswordQuestionAnswer'), trigger: ['blur', 'change'] }],
        newPasswordQuestionType: [{ required: true, message: this.$t('main_reset_password_secret_rules_newPasswordQuestionType'), trigger: 'change' }],
        newPasswordQuestionAnswer: [{ required: true, message: this.$t('main_reset_password_secret_rules_newPasswordQuestionAnswer'), trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
    this.getQuestion()
  },
  methods: {
    getQuestion () {
      fetchQuestion(this.$store.state.username).then(res => {
        if (res.success) {
          const { question, type } = res.data
          this.secretQuestion = question
          this.form.oldPasswordQuestionType = type
        }
      })
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateSecret(this.form).then(res => {
            if (res.success) {
              this.$message.success(this.$t('main_reset_password_secret_handleSubmit_success'))
              this.$refs.form.resetFields()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box{
    width: 380px;
    .top-tip{
        margin-bottom: 10px;
        color: #303133;
        line-height: 36px;
    }
    .sub-tip{
        color: #909399;
        line-height: 30px;
    }
}
</style>
