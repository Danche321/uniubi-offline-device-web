<template>
  <el-form ref="form" :model="form" class="from" :rules="rules" @submit.native.prevent="nextStep">
    <p class="tip">{{$t('main_lost_password_secret_tip')}}</p>
    <el-form-item :label="question" prop="question">
      <el-input v-model.trim="form.question" clearable></el-input>
    </el-form-item>
    <el-button type="primary" @click="nextStep" class="btn-next">{{$t('main_lost_password_secret_button_text')}}</el-button>
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
        question: [{ required: true, message: this.$t('main_lost_password_secret_rules_question'), trigger: 'blur' }]
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
