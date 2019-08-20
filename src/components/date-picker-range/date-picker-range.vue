<template>
  <div>
    <el-date-picker
      v-model="startTime"
      value-format="yyyy-MM-dd"
      type="date"
      :picker-options="startOptions"
      @change="startTimeChange">
    </el-date-picker>
    <span class="time--link">-</span>
    <el-date-picker
      v-model="endTime"
      value-format="yyyy-MM-dd"
      type="date"
      :picker-options="endOptions"
      @change="endTimeChange">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: 'DatePickerRange',
  data () {
    return {
      startTime: '',
      endTime: ''
    }
  },
  props: {
    defultTime: {

    }
  },
  computed: {
    startOptions () {
      const vm = this
      return {
        disabledDate (time) {
          if (vm.endTime) {
            return time.getTime() > new Date(vm.endTime).getTime()
          }
          return false
        }
      }
    },
    endOptions () {
      const vm = this
      return {
        disabledDate (time) {
          if (vm.startTime) {
            return time.getTime() < new Date(vm.startTime).getTime() - 86400000
          }
          return false
        }
      }
    }
  },
  methods: {
    startTimeChange (val) {
      if (typeof this.defultTime === 'string') {
        this.$emit('update:startTime', val ? `${val} 00:00:00` : '')
      } else {
        this.$emit('update:startTime', val)
      }
    },
    endTimeChange (val) {
      if (typeof this.defultTime === 'string') {
        this.$emit('update:endTime', val ? `${val} 23:59:59` : '')
      } else {
        this.$emit('update:endTime', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.time--link{
  padding: 0 7px;
}
</style>


