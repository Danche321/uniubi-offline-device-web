<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>固件升级
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
            <el-form-item label="上传固件：" prop="fileName">
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
                <el-button>选择</el-button>
              </el-upload>
            </el-form-item>

            <div class="ml100 pt20">
              <el-button @click="$router.go(-1)">取消</el-button>
              <el-button type="primary" @click="handleUpgrade()">升级</el-button>
            </div>
          </el-form>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      title="校时失败设备"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" label="设备名称" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" label="设备序列号" min-width="80"></el-table-column>
          <el-table-column prop="reason" label="失败原因" min-width="200">
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
          { required: true, message: '还未上传固件', trigger: 'blur' }
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
                this.$message.success('固件升级成功！')
                this.$router.go(-1)
              }
            }
          })
        }
      })
    },
    fileCheck (file) {
      const fileTypeList = ['image/jpeg', 'image/png', 'image/jpg'] // 支持的文件格式
      const fileMaxSize = 2 // 文件大小限制 单位MB
      const fileType = file.type
      const fileSize = file.size
      if (!fileTypeList.includes(fileType)) {
        this.$message.error('文件格式不正确，请重新选择')
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error('文件过大，请重新选择')
        return false
      }
      return true
    },
    handleUpload (file) {
      var formFile = new FormData()
      formFile.append('file', file.file)
      api.upgradeFile().then(res => {
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
