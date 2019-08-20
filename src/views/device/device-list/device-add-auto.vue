<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"
        ><i class="iconfont icon-retreat"></i>自动添加</span
      >
    </div>
    <div class="page__content">
      <div v-if="searchLoading" class="header__searching">
        <i class="iconfont icon-load"></i>
        <p class="text">正在搜索中···（{{ searchSecond }}s）</p>
      </div>
      <div v-else class="header__result">
        <p>搜索到设备（{{ listData.length }}）</p>
        <el-button type="text" @click="handleSearch">重新检查</el-button>
      </div>
      <el-table
        :data="listData"
        height="100%"
        v-loading="searchLoading"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          prop="deviceKey"
          label="设备序列号"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="sdkVersion"
          label="软件版本"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="deviceName"
          label="设备名称"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="deviceGroupName"
          label="设备组"
          min-width="80"
        ></el-table-column>
        <el-table-column prop="deviceGroup" label="操作" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.alreadyExist">已接入</span>
            <span v-else class="f-blue f-pointer" @click="handleAdd(scope.row)"
              >添加</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="自动添加"
      :visible.sync="dialog.visible"
      width="400px"
      :close-on-click-modal="false"
      @close="$refs.form.resetFields()"
    >
      <el-form
        ref="form"
        :model="dialog.form"
        :rules="dialog.rules"
        label-position="top"
      >
        <el-form-item prop="deviceName" label="名称" required>
          <el-input v-model.trim="dialog.form.deviceName" clearable></el-input>
        </el-form-item>
        <el-form-item prop="groupId" label="分组">
          <el-select v-model="dialog.form.groupId" clearable class="w100">
            <el-option
              v-for="item in dialog.deviceGroupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div v-if="!dialog.hasPassword">
          <el-form-item prop="newPassword1">
            <div slot="label" style="display: inline-block">
              <span class="mr20">设置设备密码</span>
              <el-checkbox
                v-model="useAdminPassword"
                class="f-blue"
                @change="handleUseAdmin"
                >使用Admin密码</el-checkbox
              >
            </div>
            <input type="text" class="f-hidden" />
            <input type="password" class="f-hidden" />
            <el-input
              v-model.trim="dialog.form.newPassword1"
              type="password"
              :disabled="useAdminPassword"
              placeholder="请输入密码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="newPassword2">
            <el-input
              v-model.trim="dialog.form.newPassword2"
              type="password"
              :disabled="useAdminPassword"
              placeholder="请再次输入密码"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item
          v-else
          prop="oldPassword"
          label="设备已存在密码，请输入密码"
        >
          <el-input
            v-model.trim="dialog.form.oldPassword"
            type="password"
            placeholder="请输入密码"
            clearable
          ></el-input>
        </el-form-item>
        <div class="ac mt30">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handelDialogAdd">添加</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { passwordAgainRule } from '@/libs/rules'
import {
  autoSearchDevice,
  searchDeivceResult,
  createDevice
} from '@/api/device/device'
import { fetchDeviceGroupAll } from '@/api/common'

export default {
  name: 'device-add-auto',
  data () {
    const psw2Validate = (rule, value, callback) => {
      passwordAgainRule(rule, value, callback, this.dialog.form.newPassword1)
    }
    return {
      listData: [],
      dialog: {
        visible: false,
        hasPassword: null,
        deviceGroupList: [],
        form: {
          ip: '',
          deviceKey: '',
          deviceName: '',
          groupId: '',
          newPassword1: '',
          newPassword2: '',
          oldPassword: ''
        },
        rules: {
          deviceName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          newPassword1: [
            { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
          ],
          newPassword2: [
            { required: true, message: '请输入确认密码', trigger: ['blur', 'change'] },
            { validator: psw2Validate, trigger: 'blur' }
          ],
          oldPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      },
      searchLoading: false,
      searchTimer: null,
      searchSecond: 10,
      useAdminPassword: false
    }
  },
  computed: {
    adminPass () {
      return this.$store.state.adminPass
    }
  },
  beforeDestroy () {
    clearInterval(this.searchTimer)
  },
  created () {
    this.getAllGroup()
    this.handleSearch()
  },
  methods: {
    // 使用admin密码
    handleUseAdmin (val) {
      if (val) {
        this.dialog.form.newPassword1 = require('js-base64').Base64.decode(
          this.adminPass
        )
        this.dialog.form.newPassword2 = require('js-base64').Base64.decode(
          this.adminPass
        )
      } else {
        this.dialog.form.newPassword1 = this.dialog.form.newPassword2 = ''
      }
    },
    // 搜索
    handleSearch () {
      this.searchSecond = 10
      this.searchLoading = true
      clearInterval(this.searchTimer)
      this.handleStartSearch().then(() => {
        this.handleGetResult()
        this.searchTimer = setInterval(() => {
          if (this.searchSecond > 0) {
            this.searchSecond--
            this.handleGetResult()
          } else {
            clearInterval(this.searchTimer)
            this.searchLoading = false
          }
        }, 1000)
      })
    },
    // 发起设备搜索
    handleStartSearch () {
      return new Promise((resolve, reject) => {
        autoSearchDevice()
          .then(res => {
            if (res.success) {
              resolve()
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 查询搜索结果
    handleGetResult () {
      searchDeivceResult().then(res => {
        if (res.success) {
          this.listData = res.data
          if (res.data.length) this.searchLoading = false
        }
      })
    },
    handleAdd (item) {
      this.dialog.visible = true
      this.dialog.hasPassword = item.hasPassword
      this.dialog.form.ip = item.ip
      this.dialog.form.deviceKey = item.deviceKey
      this.dialog.form.deviceName = item.deviceName
    },
    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.dialog.deviceGroupList = res.data
        }
      })
    },
    handelDialogAdd () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const {
            deviceKey,
            deviceName,
            groupId,
            ip,
            newPassword2,
            oldPassword
          } = this.dialog.form
          let oldPwd, newPwd
          if (this.dialog.hasPassword) {
            newPwd = ''
            oldPwd = oldPassword
          } else {
            newPwd = newPassword2
            oldPwd = newPwd
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
              this.$message.success('添加成功')
              this.dialog.visible = false
              this.handleGetResult()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header__searching {
  text-align: center;
  width: 100%;
  padding: 40px 0;
  .text {
    color: #303133;
    margin-top: 20px;
  }
}
.header__result {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}
</style>
