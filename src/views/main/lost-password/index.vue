<template>
  <div>
    <header-bar />
    <div class="unLogin-box">
      <div class="body">
        <p class="title">{{$t('main_lost_password_title')}}</p>
        <ul class="progress">
          <li
            v-for="(item, index) in progress"
            :key="index"
            class="progress__item"
            :class="{
              'progress__item--complete': index + 1 < progressIndex,
              'progress__item--current': index + 1 === progressIndex
            }"
          >
            <span class="progress__index">{{ index + 1 }}</span>
            <span class="progress__text">{{ item.text }}</span>
          </li>
        </ul>
        <step-secret v-if="progressIndex === 1" @nextStep="step1CallBack" />
        <step-password v-else-if="progressIndex === 2" ref="step2" @nextStep="progressIndex++" />
        <step-success v-else-if="progressIndex === 3" />
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from '@/components/header-login/HeaderLogin'
import stepSecret from './components/secret'
import stepPassword from './components/password'
import stepSuccess from './components/success'
export default {
  name: 'lostPwd',
  components: {
    headerBar,
    stepSecret,
    stepPassword,
    stepSuccess
  },
  data () {
    return {
      progress: [
        { text: this.$t('main_lost_password_progress_0_text') },
        { text: this.$t('main_lost_password_progress_1_text') },
        { text: this.$t('main_lost_password_progress_2_text') }
      ],
      progressIndex: 1,
      params: {
        name: ''
      }
    }
  },
  methods: {
    step1CallBack (val) {
      this.progressIndex++
      this.$nextTick(() => {
        const { questionType, question } = val
        this.$refs.step2.preStepParams.passwordQuestionAnswer = question
        this.$refs.step2.preStepParams.passwordQuestionType = questionType
      })
    }
  }
}
</script>

<style lang="scss">
</style>
