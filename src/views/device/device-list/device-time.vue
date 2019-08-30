<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{$t('device_time.title')}}
      </span>
    </div>

    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <div class="content__form">
          <el-form
            class="psw__form"
            :model="timeForm"
            ref="timeForm"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="100px">
            <el-form-item :label="`${$t('device_time.form.timeArea')}：`">
              {{$t('device_time.form.beijing')}}
            </el-form-item>
            <el-form-item :label="`${$t('device_time.form.typeLabel')}：`">
              <el-radio v-model="timeForm.handle" :label="true">{{$t('device_time.form.setManual')}}</el-radio>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                class="mr20"
                v-model="timeForm.date"
                value-format="yyyy-MM-dd"
                type="date">
              </el-date-picker>
              <el-time-picker
                class="mr20"
                v-model="timeForm.time"
                value-format="HH:mm:ss">
              </el-time-picker>
              <el-checkbox v-model="timeForm.nowTime" @change="handleCheck()">{{$t('device_time.form.selfTime')}}</el-checkbox>
              <p class="tip f-red">
                <span v-show="(!timeForm.date || !timeForm.time) && validate">
                  {{$t('device_time.form.message')}}
                </span>
              </p>
              <p class="tip mb30 pb10">{{$t('device_time.form.tip1')}}；<br />{{$t('device_time.form.tip2')}}</p>
            </el-form-item>
            <div class="ml100">
              <el-button @click="$router.push({name: 'batch'})">{{$t('common_cancel')}}</el-button>
              <el-button type="primary" @click="handleSaveTime()">{{$t('common_save')}}</el-button>
            </div>
          </el-form>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      :title="$t('device_time.dialog.title')"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" :label="$t('device_time.dialog.deviceName')" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('device_time.dialog.deviceKey')" min-width="80"></el-table-column>
          <el-table-column prop="reason" :label="$t('device_time.dialog.failReason')" min-width="200">
            <template slot-scope="scope">
              <span class="f-red">{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/device/device'
import { getDate } from '@/libs/util'

export default {
  name: 'deviceTime',
  data () {
    return {
      dialog: {
        failVisible: false
      },
      failList: [],
      checkList: [],
      timeForm: {
        nowTime: false,
        date: '',
        time: '',
        handle: true
      },
      validate: false
    }
  },
  computed: {
    fullTime () {
      return `${this.timeForm.date} ${this.timeForm.time}`
    }
  },
  created () {
    this.checkList = JSON.parse(sessionStorage.getItem('deviceList'))
  },
  methods: {
    handleCheck () {
      if (this.timeForm.nowTime) {
        const times = getDate().split(' ')
        this.timeForm.time = times[1]
        this.timeForm.date = times[0]
      }
    },
    handleSaveTime () {
      this.validate = true
      if (!this.timeForm.date || !this.timeForm.time) return
      let params = {
        time: this.fullTime,
        deviceKeyList: this.checkList.map(ele => ele.deviceKey)
      }
      api.timeConfig(params).then(res => {
        if (res.success) {
          this.failList = res.data.filter(ele => !ele.success)
          if (this.failList.length) {
            this.dialog.failVisible = true
          } else {
            this.$message.success(this.$t('device_time.successMsg'))
            this.$router.go(-1)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ml100{
  margin-left: 100px;
}
.content__form/deep/{
  width: 600px;
  margin:50px auto;
  .el-form-item{
    margin-bottom: 10px;
  }
  .el-date-editor{
    width: 160px;
  }
  .tip{
    height: 20px;
    line-height: 20px;
    color: #909399;
    font-size: 12px;
  }
}
.table__fail/deep/{
  tr>th{
    border-top: none;
  }
}
</style>
