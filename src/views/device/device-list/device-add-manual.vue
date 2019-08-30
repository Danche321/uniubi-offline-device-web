<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"
        ><i class="iconfont icon-retreat"></i>{{$t('device_addManual.title')}}</span
      >
    </div>
    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item prop="deviceName" :label="$t('device_addManual.name')">
            <el-input v-model.trim="form.deviceName" clearable></el-input>
          </el-form-item>
          <el-form-item prop="ip" :label="$t('device_addManual.ipAddress')">
            <ip-input
              v-model="form.ip"
              color="#000"
              borderColor="#dcdfe6"
              @blur="handleIpChange"
            >
            </ip-input>
          </el-form-item>
          <hr class="mt30 mb20" />
          <p>{{$t('device_addManual.checkDevice')}}</p>
          <p
            class="mt10 mb20 loading-wrap"
            :class="{ 'f-error': checkedStatus === 3 }"
            v-loading="ipLoading"
            element-loading-spinner="el-icon-loading"
          >
            {{ checkedStatus | checkedStatusText(form.deviceKey) }}
          </p>
          <el-form-item prop="groupId" :label="$t('device_addManual.group')">
            <el-select v-model="form.groupId" style="width: 100%">
              <el-option
                v-for="item in deviceGroupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="checkedStatus === 2 && !isSetPassword">
            <el-form-item prop="newPassword1">
              <div slot="label" style="display: inline-block">
                <span class="mr20">{{$t('device_addManual.setPassword')}}</span>
                <el-checkbox
                  v-model="useAdminPassword"
                  class="f-blue"
                  @change="handleUseAdmin"
                  >{{$t('device_addManual.userAdminPassword')}}</el-checkbox
                >
              </div>
              <el-input
                v-model.trim="form.newPassword1"
                type="password"
                :placeholader="$t('device_addManual.setPasswordTip')"
                :disabled="useAdminPassword"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="newPassword2">
              <el-input
                v-model.trim="form.newPassword2"
                type="password"
                :placeholader="$t('device_addManual.samePassword')"
                :disabled="useAdminPassword"
                clearable
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item
            v-if="checkedStatus === 2 && isSetPassword"
            prop="oldPassword"
            :placeholader="$t('device_addManual.hasPasswordTip')"
          >
            <el-input
              v-model.trim="form.oldPassword"
              type="password"
              clearable
            ></el-input>
          </el-form-item>
          <div class="mt30">
            <el-button @click="handleCancel">{{$t('common_cancel')}}</el-button>
            <el-button type="primary" @click="handelSubmit">{{$t('common_add')}}</el-button>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  nameRule,
  ipRule,
  passwordRule,
  passwordAgainRule
} from '@/libs/rules'
import { fetchDeviceKey, createDevice } from '@/api/device/device'
import IpInput from '@/components/ip-input'
import { fetchDeviceGroupAll } from '@/api/common'
export default {
  name: 'device-add-manual',
  components: {
    IpInput
  },
  data () {
    const psw2Validate = (rule, value, callback) => {
      passwordAgainRule(rule, value, callback, this.form.newPassword1)
    }
    return {
      form: {
        ip: '',
        deviceName: '',
        deviceKey: '',
        groupId: '',
        newPassword1: '',
        newPassword2: '',
        oldPassword: ''
      },
      rules: {
        deviceName: [
          { required: true, message: this.$t('device_addManual.message.requiredName'), trigger: 'blur' },
          { validator: nameRule, trigger: 'blur' }
        ],
        ip: [
          { required: true, message: this.$t('device_addManual.message.requiredIpAddress'), trigger: 'blur' },
          { validator: ipRule, trigger: 'blur' }
        ],
        newPassword1: [
          {
            required: true,
            message: this.$t('device_addManual.message.requiredPassword'),
            trigger: ['blur', 'change']
          },
          { validator: passwordRule, trigger: 'blur' }
        ],
        newPassword2: [
          {
            required: true,
            message: this.$t('device_addManual.message.requiredAgain'),
            trigger: ['blur', 'change']
          },
          { validator: psw2Validate, trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: this.$t('device_addManual.message.requiredPassword'), trigger: 'blur' }
        ]
      },
      checkedStatus: 1, // 1初始值 2检测到设备 3未检测到设备
      isSetPassword: null,
      deviceGroupList: [],
      ipLoading: false,
      useAdminPassword: false
    }
  },
  filters: {
    checkedStatusText (status, deviceKey) {
      switch (status) {
        case 1:
          return '-'
        case 2:
          return deviceKey
        case 3:
          return this.$t('device_addManual.message.noIp')
      }
    }
  },
  computed: {
    adminPass () {
      return this.$store.state.adminPass
    }
  },
  created () {
    this.getAllGroup()
  },
  methods: {
    // 使用admin密码
    handleUseAdmin (val) {
      if (val) {
        this.form.newPassword1 = require('js-base64').Base64.decode(
          this.adminPass
        )
        this.form.newPassword2 = require('js-base64').Base64.decode(
          this.adminPass
        )
      } else {
        this.form.newPassword1 = this.form.newPassword2 = ''
      }
    },
    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.deviceGroupList = res.data
        }
      })
    },
    handleIpChange (val) {
      if ((val && val.split('.').length < 4) || !val) return false
      this.ipLoading = true
      fetchDeviceKey({ ip: this.form.ip })
        .then(res => {
          if (res.success) {
            if (res.data) {
              const { deviceKey, passwordSet } = res.data
              this.checkedStatus = 2
              this.form.deviceKey = deviceKey
              this.isSetPassword = passwordSet
            } else {
              this.checkedStatus = 3
              this.form.deviceKey = ''
            }
          } else {
            this.checkedStatus = 3
            this.form.deviceKey = ''
          }
          this.ipLoading = false
        })
        .catch(() => {
          this.ipLoading = false
        })
    },
    handleCancel () {
      this.$router.back()
    },
    handelSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.deviceKey) {
            return this.$message.error(this.$t('device_addManual.message.requiredDevice'))
          }
          const {
            deviceKey,
            deviceName,
            groupId,
            ip,
            newPassword2,
            oldPassword
          } = this.form
          let oldPwd, newPwd
          if (this.isSetPassword) {
            newPwd = ''
            oldPwd = oldPassword
          } else {
            newPwd = newPassword2
            oldPwd = newPassword2
          }
          const params = {
            deviceKey,
            deviceName,
            groupId,
            ip,
            newPass: newPwd,
            oldPass: oldPwd
          }
          createDevice(params).then(res => {
            if (res.success) {
              this.$message.success(this.$t('device_addManual.message.addSuccess'))
              this.$router.back()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content {
  .scroll--y {
    height: 100%;
  }
}
.el-form {
  width: 340px;
}
.loading-wrap {
  /deep/ {
    .el-loading-mask {
      background-color: #fff;
    }
    .el-loading-spinner {
      top: 20px;
      left: 0;
      width: 100%;
      position: absolute;
      text-align: left;
    }
    .el-icon-loading {
      font-size: 22px;
    }
    .el-loading-spinner i {
      color: #007bf9;
    }
  }
}
</style>
