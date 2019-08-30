<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="handleBack"><i class="iconfont icon-retreat"></i>{{$t('authorize_create_title_text')}}</span>
    </div>
    <keep-alive>
      <component
        ref="active"
        v-bind:is="active"
        @employeeCallback="employeeCallback"
        @deviceCancel="deviceCancel"
      ></component>
    </keep-alive>
  </div>
</template>

<script>
import device from './components/device'
import employee from './components/employee'
export default {
  name: 'index',
  components: {
    device,
    employee
  },
  data () {
    return {
      active: 'employee'
    }
  },
  beforeDestroy () {
    clearInterval(this.$refs.active.progressTimer)
  },
  methods: {
    deviceCancel () {
      clearInterval(this.$refs.active.progressTimer)
      this.active = 'employee'
    },
    handleBack () {
      if (this.active === 'device') {
        clearInterval(this.$refs.active.progressTimer)
        this.active = 'employee'
      } else {
        this.$router.back()
      }
    },
    employeeCallback (val) {
      this.active = 'device'
      this.$nextTick(() => {
        this.$refs.active.preStepParams = JSON.parse(val)
        this.$refs.active.inAuth = false
      })
    }
  }
}
</script>

<style scoped></style>
