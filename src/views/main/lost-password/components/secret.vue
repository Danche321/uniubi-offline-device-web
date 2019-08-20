<template>
  <el-form ref="form" :model="form" class="from" :rules="rules" @submit.native.prevent="nextStep">
    <p class="tip">请回答密保问题</p>
    <el-form-item :label="question" prop="question">
      <el-input v-model.trim="form.question" clearable></el-input>
    </el-form-item>
    <el-button type="primary" @click="nextStep" class="btn-next">下一步</el-button>
  </el-form>
</template>

<script>
import { fetchQuestion, validateQuestion } from '@/api/main'
export default {
  name: 'progress1',
  data () {
    return {
      question: '',
      form: {
        questionType: '',
        question: ''
      },
      rules: {
        question: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getQuestion()
  },
  methods: {
    getQuestion () {
      fetchQuestion('Admin').then(res => {
        if (res.success) {
          const { question, type } = res.data
          this.question = question
          this.form.questionType = type
        }
      })
    },
    nextStep () {
      this.$refs.form.validate(valid => {
        if (valid) {
          validateQuestion('Admin', this.form).then(res => {
            if (res.success) {
              this.$emit('nextStep', this.form)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .tip{
    color: #303133;
    text-align: left;
    margin: 40px 0 20px 0;
  }
</style>
