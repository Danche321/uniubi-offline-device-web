<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{$t('device_wifi.title')}}
      </span>
    </div>

    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <div class="content__form">
          <el-form
            class="psw__form"
            :model="wifiForm"
            :rules="formRules"
            ref="wifiForm"
            :hide-required-asterisk="true"
            label-position="top">
            <el-form-item :label="$t('device_wifi.form.name')" prop="wifiName">
              <el-input v-model="wifiForm.wifiName" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('device_wifi.form.password')" prop="wifiPass">
              <el-input v-model="wifiForm.wifiPass" clearable></el-input>
            </el-form-item>
            <el-form-item prop="confirmPass">
              <span class="mr20">{{$t('device_wifi.form.ipType.label')}}:</span>
              <el-radio v-model="wifiForm.dhcp" :label="true">DHCP</el-radio>
              <el-radio v-model="wifiForm.dhcp" :label="false">{{$t('device_wifi.form.ipType.value')}}</el-radio>
            </el-form-item>
            <div class="ip__config" v-if="wifiForm.dhcp">
              <p class="auto__ip">{{$t('device_wifi.form.getIpAuto')}}</p>
            </div>
            <div class="ip__config" v-else>
              <p>{{$t('device_wifi.form.fixSet')}}</p>
              <el-form-item prop="ip">
                <span class="ip__label">{{$t('device_wifi.form.website')}}</span>
                <div class="ip__input">
                  <ip-input
                    v-model="wifiForm.ip"
                    color="#000"
                    borderColor="#dcdfe6">
                  </ip-input>
                </div>
              </el-form-item>

              <el-form-item prop="gateway">
                <span class="ip__label">{{$t('device_wifi.form.gateway')}}</span>
                <div class="ip__input">
                  <ip-input
                    v-model="wifiForm.gateway"
                    color="#000"
                    borderColor="#dcdfe6">
                  </ip-input>
                </div>
              </el-form-item>

              <el-form-item prop="dns">
                <span class="ip__label">DNS</span>
                <div class="ip__input">
                  <ip-input
                    v-model="wifiForm.dns"
                    color="#000"
                    borderColor="#dcdfe6">
                  </ip-input>
                </div>
              </el-form-item>
            </div>
            <div class="pt10">
              <el-button
                class="w100"
                type="primary"
                @click="handleLinkWifi()">
                {{$t('device_wifi.form.btnConnect')}}
              </el-button>
            </div>
          </el-form>
          <div
            class="wired"
            @click="dialog.wiredVisible = true">
            <i class="iconfont icon-cable"></i>{{$t('device_wifi.form.btnWiredSet')}}
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      :title="$t('device_wifi.dialogWire.title')"
      :visible.sync="dialog.wiredVisible"
      width="400px">
      <div>
        <el-form
          class="psw__form"
          :model="wiredForm"
          :rules="formRules"
          ref="wiredForm"
          :hide-required-asterisk="true"
          label-position="top">
          <el-form-item prop="confirmPass">
            <span class="mr20">$t('device_wifi.dialogWire.IpType'):</span>
            <el-radio v-model="wiredForm.dhcp" :label="true">DHCP</el-radio>
            <el-radio v-model="wiredForm.dhcp" :label="false">{{$t('device_wifi.dialogWire.fixIp')}}</el-radio>
          </el-form-item>
          <div class="ip__config" v-if="wiredForm.dhcp">
            <p class="auto__ip">{{$t('device_wifi.dialogWire.getIpAuto')}}</p>
          </div>
          <div class="ip__config" v-else>
            <p>{{$t('device_wifi.dialogWire.fixSet')}}</p>
            <el-form-item prop="ip">
              <span class="ip__label">{{$t('device_wifi.dialogWire.website')}}</span>
              <div class="ip__input">
                <ip-input
                  v-model="wiredForm.ip"
                  color="#000"
                  borderColor="#dcdfe6">
                </ip-input>
              </div>
            </el-form-item>

            <el-form-item prop="gateway">
              <span class="ip__label">{{$t('device_wifi.dialogWire.gateway')}}</span>
              <div class="ip__input">
                <ip-input
                  v-model="wiredForm.gateway"
                  color="#000"
                  borderColor="#dcdfe6">
                </ip-input>
              </div>
            </el-form-item>

            <el-form-item prop="dNS">
              <span class="ip__label">DNS</span>
              <div class="ip__input">
                <ip-input
                  v-model="wiredForm.dNS"
                  color="#000"
                  borderColor="#dcdfe6">
                </ip-input>
              </div>
            </el-form-item>
          </div>
          <div class="tip pt10">{{$t('device_wifi.dialogWire.tip')}}</div>
          <div class="ac pt30">
            <el-button @click="dialog.wiredVisible = false">{{$t('common_cancel')}}</el-button>
            <el-button type="primary" @click="handleLinkWired()">{{$t('common_save')}}</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('device_wifi.dialogFail.title')"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" :label="$t('device_wifi.dialogFail.deviceName')" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('device_wifi.dialogFail.deviceKey')" min-width="80"></el-table-column>
          <el-table-column prop="reason" :label="$t('device_wifi.dialogFail.failReason')" min-width="200">
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
import { ipRule } from '@/libs/rules'
import IpInput from '@/components/ip-input'

export default {
  name: 'deviceWifi',
  data () {
    return {
      dialog: {
        failVisible: false,
        wiredVisible: false
      },
      failList: [],
      checkList: [],
      wifiForm: {
        wifiPass: '',
        wifiName: '',
        gateway: '',
        ip: '',
        dns: '',
        dhcp: false
      },
      formRules: {
        wifiName: [
          { required: true, message: this.$t('device_wifi.message.requiredName'), trigger: 'blur' }
        ],
        wifiPass: [
          { required: true, message: this.$t('device_wifi.message.requiredPassword'), trigger: 'blur' }
        ],
        ip: [
          { required: true, message: this.$t('device_wifi.message.requiredIp'), trigger: 'blur' },
          { validator: ipRule, trigger: 'blur' }
        ],
        dns: [
          { required: true, message: this.$t('device_wifi.message.requiredDNS'), trigger: 'blur' },
          { validator: ipRule, trigger: 'blur' }
        ],
        dNS: [
          { required: true, message: this.$t('device_wifi.message.requiredDNS'), trigger: 'blur' },
          { validator: ipRule, trigger: 'blur' }
        ],
        gateway: [
          { required: true, message: this.$t('device_wifi.message.requiredGateway'), trigger: 'blur' },
          { validator: ipRule, trigger: 'blur' }
        ]
      },
      wiredForm: {
        gateway: '',
        ip: '',
        dNS: '',
        dhcp: false
      }
    }
  },
  components: {
    IpInput
  },
  created () {
    this.checkList = JSON.parse(sessionStorage.getItem('deviceList'))
  },
  methods: {
    handleLinkWifi () {
      this.$refs.wifiForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.wifiForm,
            deviceKeyList: this.checkList.map(ele => ele.deviceKey)
          }
          api.wifiConfig(params).then(res => {
            if (res.success) {
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.dialog.failVisible = true
              } else {
                this.$message.success(this.$t('device_wifi.setSuccessMsg'))
                this.$router.go(-1)
              }
            }
          })
        }
      })
    },
    handleLinkWired () {
      this.$refs.wiredForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.wiredForm,
            deviceKeyList: this.checkList.map(ele => ele.deviceKey)
          }
          api.wiredConfig(params).then(res => {
            if (res.success) {
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.dialog.failVisible = true
              } else {
                this.$message.success(this.$t('device_wifi.saveSuccessMsg'))
                this.$router.go(-1)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content__form/deep/{
  width: 340px;
  margin:50px auto;
  .el-form-item__label{
    height: 24px;
    line-height: 24px;
    padding: 0;
  }
  .wired{
    width: 460px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 20px 0 0 -60px;
    background: #f1f4f7;
    cursor: pointer;
    .iconfont{
      font-size: 18px;
      padding: 10px 10px 0 0;
    }
  }
}
.ip__config{
  width: 100%;
  background: #f1f4f7;
  padding: 10px 0 20px 10px;
  margin-top: -20PX;
  box-sizing: border-box;
  .el-form-item{
    margin: 20px 0 0 0;
  }
  .auto__ip{
    height: 187px;
  }
  .ip__label{
    display: inline-block;
    width: 50px;
    float: left;
  }
  .ip__input{
    width: 280px;
    display: inline-block;
    float: left;
  }
  .tip{
    color: #f1f1f1;
  }
}
.table__fail/deep/{
  tr>th{
    border-top: none;
  }
}
</style>
