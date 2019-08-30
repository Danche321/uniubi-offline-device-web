<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{$t('device_upgrade.title')}}
      </span>
    </div>

    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <div class="content__form">
          <el-form
            class="psw__form"
            :model="fileForm"
            :rules="fileFormRules"
            ref="fileForm"
            :hide-required-asterisk="true"
            label-position="right"
            label-width="100px">
            <el-form-item :label="$t('device_upgrade.uploadLabel')" prop="fileName">
              <el-input
                class="file__name"
                v-model="fileForm.fileName"
                placeholder=""
                clearable
                readonly>
                <i
                  v-show="fileForm.fileName"
                  slot="suffix"
                  class="el-input__icon el-icon-circle-close pointer"
                  @click="deleteFile()">
                </i>
              </el-input>
              <el-upload
                class="upload"
                action=""
                :show-file-list="false"
                :before-upload="fileCheck"
                :http-request="handleUpload">
                <el-button>{{$t('device_upgrade.select')}}</el-button>
              </el-upload>
            </el-form-item>

            <div class="ml100 pt20">
              <el-button @click="$router.go(-1)">{{$t('common_cancel')}}</el-button>
              <el-button type="primary" @click="handleUpgrade()">{{$t('device_upgrade.upgrade')}}</el-button>
            </div>
          </el-form>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      :title="$t('device_upgrade.dialog.title')"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" :label="$t('device_upgrade.dialog.deviceName')" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('device_upgrade.dialog.deviceKey')" min-width="80"></el-table-column>
          <el-table-column prop="reason" :label="$t('device_upgrade.dialog.failReason')" min-width="200">
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

export default {
  name: 'deviceUpgrade',
  data () {
    return {
      dialog: {
        failVisible: false
      },
      failList: [],
      checkList: [],
      fileForm: {
        fileId: '',
        fileName: ''
      },
      fileFormRules: {
        fileName: [
          { required: true, message: this.$t('device_upgrade.message.requiredFirmware'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.checkList = JSON.parse(sessionStorage.getItem('deviceList'))
  },
  methods: {
    handleUpgrade () {
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          let params = {
            fileId: this.fileForm.fileId,
            deviceKeyList: this.checkList.map(ele => ele.deviceKey)
          }
          api.deviceUpgrade(params).then(res => {
            if (res.success) {
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.dialog.failVisible = true
              } else {
                this.$message.success(this.$t('device_upgrade.message.upgradeSuccess'))
                this.$router.go(-1)
              }
            }
          })
        }
      })
    },
    fileCheck (file) {
      if (file && file.name.substr(file.name.lastIndexOf('.')) !== '.zip') {
        this.$message({ message: this.$t('device_upgrade.message.fileNoSupport'), type: 'error' })
        this.firmwareName = ''
        return false
      }
      if (!/^NB/.test(file.name) || file.name.split('_').length !== 5) {
        this.$message({ message: this.$t('device_upgrade.message.packageError'), type: 'error' })
        return false
      }
      return true
    },
    handleUpload (file) {
      var formFile = new FormData()
      formFile.append('file', file.file)
      api.upgradeFile(formFile).then(res => {
        if (res.success) {
          this.fileForm = {
            fileName: file.file.name,
            fileId: res.data
          }
        }
      })
    },
    deleteFile () {
      this.fileForm = {
        fileId: '',
        fileName: ''
      }
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
  .file__name{
    width: 360px;
  }
  .upload{
    display: inline-block;
    margin-left: 20px;
  }
}
.table__fail/deep/{
  tr>th{
    border-top: none;
  }
}
</style>
