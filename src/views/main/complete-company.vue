<template>
  <div>
    <header-bar />
    <div class="unLogin-box">
      <div class="company-box">
        <p class="title-text">完善公司信息</p>
        <el-form
          ref="form"
          :model="form"
          class="complete-from"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="LOGO" prop="file">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
            >
              <div
                v-if="logoUrl"
                class="upload-img"
                @mousemove="showIcon = true"
                @mouseout="showIcon = false"
              >
                <img
                  :src="`${baseUrl}/file/image/${logoUrl}`"
                  class="avatar"
                  alt="logo"
                />
                <transition>
                  <div v-show="showIcon" class="block-hover">
                    <div class="hover__iconfont">
                      <i
                        class="iconfont-item el-icon-zoom-in"
                        @click.stop="handlePreview"
                      ></i>
                      <i
                        class="iconfont-item el-icon-delete"
                        @click.stop="handleRemove"
                      ></i>
                    </div>
                  </div>
                </transition>
              </div>
              <div v-else class="el-upload el-upload--picture-card">
                <i class="el-icon-plus"></i>
              </div>
              <div class="upload__tip">
                <p>图片大小不得超过2M</p>
                <p>文件格式支持jpg、jpeg、png</p>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="企业名称"
            prop="orgName"
            class="f-form-item--half mr20"
          >
            <el-input v-model.trim="form.orgName"></el-input>
          </el-form-item>
          <el-form-item
            label="企业简称"
            prop="orgAbbreviation"
            class="f-form-item--half"
          >
            <el-input v-model.trim="form.orgAbbreviation"></el-input>
          </el-form-item>
          <el-form-item
            label="行业类型"
            prop="industryType"
            class="f-form-item--half mr20"
          >
            <el-cascader
              style="width: 100%"
              expand-trigger="hover"
              :options="select.industryType"
              @change="handleChange"
              popper-class="industry-option"
              v-model="industryTypeRealValue"
              placeholder="请选择"
              separator=">"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="规模" prop="empNumber" class="f-form-item--half">
            <el-select
              v-model="form.empNumber"
              placeholder="请选择"
              style="width: 100%"
              clearable
              v-leftClear
            >
              <el-option
                v-for="item in select.empNumber"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="contactWay"
            class="f-form-item--half mr20"
          >
            <el-input v-model.trim="form.contactWay"></el-input>
          </el-form-item>
          <el-form-item
            label="官网地址"
            prop="orgUrl"
            class="f-form-item--half"
          >
            <el-input v-model.trim="form.orgUrl"></el-input>
          </el-form-item>
          <el-form-item label="标语" prop="slogan">
            <el-input v-model.trim="form.slogan"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input
              type="textarea"
              rows="3"
              resize="none"
              v-model.trim="form.introduction"
            ></el-input>
          </el-form-item>
          <div class="ac mt30">
            <el-button type="primary" @click="handleSubmit" class="btn-submit"
              >保存</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      v-if="previewDialog.visible"
      :visible.sync="previewDialog.visible"
      :width="previewDialog.width"
      class="dialog-preview"
    >
      <img :src="previewDialog.url" alt="" @load="handleImgLoad" />
    </el-dialog>
  </div>
</template>

<script>
import headerBar from '@/components/header-login/HeaderLogin'
import { uploadImg, createCompany } from '@/api/main'
import { nameRule, telPhoneNumRule, urlRule } from '@/libs/rules'
import industryType from '@/static/json/industryType'
export default {
  name: 'complete-company',
  components: {
    headerBar
  },
  data () {
    return {
      form: {
        logo: '',
        orgName: '',
        orgAbbreviation: '',
        industryType: '',
        empNumber: '',
        contactWay: '',
        orgUrl: '',
        slogan: '',
        introduction: ''
      },
      logoUrl: '',
      rules: {
        orgName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { validator: nameRule, trigger: 'blur' }
        ],
        contactWay: [{ validator: telPhoneNumRule, trigger: 'blur' }],
        orgUrl: [{ validator: urlRule, trigger: 'blur' }]
      },
      industryTypeRealValue: [],
      select: {
        industryType,
        empNumber: [
          { key: 0, label: '1~50 人' },
          { key: 1, label: '51~100 人' },
          { key: 2, label: '101~200 人' },
          { key: 3, label: '201~500 人' },
          { key: 4, label: '501~1000 人' },
          { key: 5, label: '1000 人以上' }
        ]
      },
      showIcon: false,
      previewDialog: {
        visible: false,
        url: '',
        width: ''
      }
    }
  },
  methods: {
    handleImgLoad (e) {
      this.previewDialog.width = `${e.target.width}px`
    },
    handleChange () {
      const aIndustryType = this.industryTypeRealValue
      this.form.industryType = aIndustryType[aIndustryType.length - 1]
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          createCompany(this.form).then(res => {
            if (res.success) {
              const companyInfo = Object.assign(
                {},
                JSON.parse(this.$store.state.userInfo),
                { orgLogo: this.logoUrl },
                { orgName: this.form.orgName }
              )
              this.$store.commit('setUserInfo', JSON.stringify(companyInfo))
              this.$store.commit('updateIsActive', 1)
              localStorage.setItem('isActive', 1)
              this.$message.success('创建成功！')
              this.$router.push('/home')
            }
          })
        }
      })
    },
    handlePreview () {
      this.previewDialog = {
        visible: true,
        url: `${this.baseUrl}/file/image/${this.logoUrl}`
      }
    },
    handleRemove () {
      this.logoUrl = ''
      this.form.logo = ''
    },
    beforeUpload (file) {
      const fileType = ['image/jpeg', 'image/png', 'image/jpg'].includes(
        file.type
      )
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!fileType) {
        this.$message.error('文件格式不正确，请重新选择！')
      }
      if (!isLt2M) {
        this.$message.error('上传照片大小不能超过 2MB!')
      }
      return fileType && isLt2M
    },
    handleUpload (file) {
      const params = new FormData()
      params.append('file', file.file)
      uploadImg(params).then(res => {
        if (res.success) {
          const { data } = res
          this.logoUrl = data
          this.form.logo = data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-form-item__label {
    padding-bottom: 0;
  }
}
.unLogin-box {
  height: 88vh;
  overflow-y: scroll;
}
.company-box {
  height: 87vh;
  min-height: 820px;
  .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .title-text {
    font-size: 20px;
    color: #303133;
    padding: 40px 0;
    text-align: center;
  }
  .f-form-item--half {
    display: inline-block;
    width: 220px;
  }
  .complete-from {
    width: 460px;
    margin: auto;
  }
  .avatar {
    height: 120px;
  }
  .upload__tip {
    float: right;
    text-align: left;
    font-size: 14px;
    color: #606266;
    line-height: 24px;
    margin-top: 76px;
    padding-left: 10px;
  }
  .upload-img {
    position: relative;
    height: 120px;
    display: inline-block;
  }
  .block-hover {
    position: absolute;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .hover__iconfont {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .iconfont {
      font-size: 22px;
      color: #fff;
      margin: 10px;
      cursor: pointer;
      display: inline;
    }
  }
}
.dialog-preview {
  /deep/ {
    .el-dialog {
      min-width: 30%;
    }
    img {
      max-width: 100%;
      margin: auto;
      display: block;
    }
  }
}
</style>
