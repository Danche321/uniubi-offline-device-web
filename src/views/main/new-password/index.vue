<template>
  <div>
    <header-bar />
    <div class="unLogin-box">
      <div class="body">
        <p class="title">设置新密码</p>
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
        <step-password v-if="progressIndex === 1" @nextStep="step1Callback" />
        <step-secret v-else-if="progressIndex === 2" ref="progress2" @nextStep="progressIndex++" />
        <step-success v-else-if="progressIndex === 3"/>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from '@/components/header-login/HeaderLogin'
import stepPassword from './components/password'
import stepSecret from './components/secret'
import stepSuccess from './components/success'
export default {
  name: 'newPwd',
  components: {
    headerBar,
    stepPassword,
    stepSecret,
    stepSuccess
  },
  data () {
    return {
      progress: [
        { text: '设置新密码' },
        { text: '设置新密保问题' },
        { text: '完成' }
      ],
      progressIndex: 1
    }
  },
  methods: {
    step1Callback (val) {
      this.progressIndex++
      this.$nextTick(() => {
        this.$refs.progress2.preStepParams = JSON.parse(val)
      })
    }
  }
}
</script>

<style lang="scss">
</style>
