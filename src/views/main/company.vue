<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">{{$t('main_company_title')}}</span>
    </div>
    <div class="page__box">
      <el-form
        ref="form"
        :model="form"
        class="from"
        :rules="rules"
        label-position="top"
      >
        <el-form-item :label="$t('main_company_logo_label')" prop="file">
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
                :alt="$t('main_company_logo_alt')"
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
              <p>{{$t('main_company_logo_upload_tip1')}}</p>
              <p>{{$t('main_company_logo_upload_tip2')}}</p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          :label="$t('main_company_orgName_label')"
          prop="orgName"
          class="f-form-item--half mr20"
        >
          <el-input v-model.trim="form.orgName"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('main_company_orgAbbreviation_label')"
          prop="orgAbbreviation"
          class="f-form-item--half"
        >
          <el-input v-model.trim="form.orgAbbreviation"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('main_company_industryType_label')"
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
            :placeholder="$t('common_placeholder')"
            v-leftClear
            separator=">"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('main_company_iempNumber_label')" prop="empNumber" class="f-form-item--half">
          <el-select
            v-model="form.empNumber"
            :placeholder="$t('common_placeholder')"
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
          :label="$t('main_company_contactWay_label')"
          prop="contactWay"
          class="f-form-item--half mr20"
        >
          <el-input v-model.trim="form.contactWay"></el-input>
        </el-form-item>
        <el-form-item :label="$t('main_company_orgUrl_label')" prop="orgUrl" class="f-form-item--half">
          <el-input v-model.trim="form.orgUrl"></el-input>
        </el-form-item>
        <el-form-item :label="$t('main_company_slogan_label')" prop="slogan">
          <el-input v-model.trim="form.slogan"></el-input>
        </el-form-item>
        <el-form-item :label="$t('main_company_introduction_label')" prop="introduction">
          <el-input
            type="textarea"
            rows="3"
            resize="none"
            v-model.trim="form.introduction"
          ></el-input>
        </el-form-item>
        <div class="al mt30">
          <el-button type="primary" @click="handleSubmit">{{$t('main_company_submit_text')}}</el-button>
        </div>
      </el-form>
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
import { uploadImg, fetchCompany, updateCompany } from '@/api/main'
import { nameRule, telPhoneNumRule, urlRule } from '@/libs/rules'
import industryType from '@/static/json/industryType'
export default {
  name: 'company',
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
      industryTypeRealValue: [],
      select: {
        industryType,
        empNumber: [
          { key: 0, label: this.$t('main_company_select_empNumber_0') },
          { key: 1, label: this.$t('main_company_select_empNumber_1') },
          { key: 2, label: this.$t('main_company_select_empNumber_2') },
          { key: 3, label: this.$t('main_company_select_empNumber_3') },
          { key: 4, label: this.$t('main_company_select_empNumber_4') },
          { key: 5, label: this.$t('main_company_select_empNumber_5') }
        ]
      },
      rules: {
        orgName: [
          { required: true, message: this.$t('main_company_rules_orgName'), trigger: 'blur' },
          { validator: nameRule, trigger: 'blur' }
        ],
        contactWay: [{ validator: telPhoneNumRule, trigger: 'blur' }],
        orgUrl: [{ validator: urlRule, trigger: 'blur' }]
      },
      showIcon: false,
      previewDialog: {
        visible: false,
        url: '',
        width: ''
      }
    }
  },
  computed: {
    orgId () {
      return JSON.parse(this.$store.state.userInfo).orgId
    }
  },
  created () {
    this.getCompanyInfo()
  },
  methods: {
    handleImgLoad (e) {
      this.previewDialog.width = `${e.target.width}px`
    },
    handleChange () {
      const aIndustryType = this.industryTypeRealValue
      this.form.industryType = aIndustryType[aIndustryType.length - 1]
    },
    getCompanyInfo () {
      fetchCompany().then(res => {
        if (res.success) {
          this.form = res.data
          this.logoUrl = res.data.logo
          this.industryTypeRealValue = [
            this.form.industryType.split('_')[0],
            this.form.industryType
          ]
        }
      })
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateCompany(this.orgId, this.form).then(res => {
            if (res.success) {
              const companyInfo = Object.assign(
                {},
                JSON.parse(this.$store.state.userInfo),
                { orgLogo: this.logoUrl },
                { orgName: this.form.orgName }
              )
              this.$store.commit('setUserInfo', JSON.stringify(companyInfo))
              this.$message.success(this.$t('main_company_handleSubmit_success'))
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
        this.$message.error(this.$t('main_company_beforeUpload_error_1'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('main_company_beforeUpload_error_2'))
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
          this.showIcon = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-form-item__label {
    padding-bottom: 0 !important;
  }
}
.page__box {
  background-color: #fff;
  width: 100%;
  padding: 10px 20px 0 20px;
  height: calc(100vh - 140px);
  min-height: 800px;
  box-sizing: border-box;
  .from {
    width: 460px;
    height: calc(100vh - 140px);
    min-height: 800px;
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
      display: inline-block;
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
    .iconfont-item {
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
    .el-dialog{
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
