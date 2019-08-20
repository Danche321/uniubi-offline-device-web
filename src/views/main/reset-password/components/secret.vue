<template>
    <el-form ref="form" :model="form" class="form-box" :rules="rules">
        <p class="top-tip">请回答密保问题</p>
        <el-form-item :label="secretQuestion" prop="oldPasswordQuestionAnswer">
            <el-input v-model.trim="form.oldPasswordQuestionAnswer" clearable></el-input>
        </el-form-item>
        <el-form-item label="请选择密保问题" prop="newPasswordQuestionType">
            <el-select v-model="form.newPasswordQuestionType" placeholder="请选择" style="width: 100%" clearable v-leftClear>
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
            <p class="sub-tip">提示：请妥善保存新的密保问题</p>
        </el-form-item>
        <el-button type="primary" @click="handleSubmit" class="btn-login mt10">修改</el-button>
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
        oldPasswordQuestionAnswer: [{ required: true, message: '请回答密保问题', trigger: ['blur', 'change'] }],
        newPasswordQuestionType: [{ required: true, message: '请选择新密保问题', trigger: 'change' }],
        newPasswordQuestionAnswer: [{ required: true, message: '请设置新密保答案', trigger: ['blur', 'change'] }]
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
              this.$message.success('修改成功')
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
