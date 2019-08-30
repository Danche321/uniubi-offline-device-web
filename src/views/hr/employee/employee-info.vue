<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="handleCancleSave()">
        <i class="iconfont icon-retreat"></i>
        {{ isAdd ? $t('emp_info_page_add_title') : $t('emp_info_page_edit_title') }}
      </span>
    </div>

    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <div class="content__form">
          <el-form
            ref="empForm"
            class="page__content--filter"
            label-position="top"
            :inline="true"
            :model="empForm"
            :rules="empFormRules">
            <p class="form__title">{{ $t('emp_info_page_sub_title1') }}</p>
            <el-form-item :label="$t('emp_info_form_label1')" prop="name">
              <el-input v-model="empForm.name" @blur="empForm.name = empForm.name.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label2')" class="gender">
              <el-radio v-model="empForm.gender" :label="1">{{ $t('emp_info_gender_label1') }}</el-radio>
              <el-radio v-model="empForm.gender" :label="2">{{ $t('emp_info_gender_label2') }}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label3')" prop="phone">
              <el-input v-model="empForm.phone" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label4')" prop="mail">
              <el-input v-model="empForm.mail" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label5')" prop="workNo">
              <el-input v-model="empForm.workNo" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label6')" prop="stageName">
              <el-input v-model="empForm.stageName" @blur="empForm.stageName = empForm.stageName.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label7')" prop="empNo">
              <uniubi-input
                :focus-message="$t('emp_info_empNo_tip')"
                v-model="empForm.empNo"
                :readonly="!isAdd"
                clearable>
              </uniubi-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label8')" v-if="!isAdd" prop="cardNo">
              <div class="lable__tip" @click="handleDeviceDialogShow('card')">
                {{ $t('emp_info_cardNo_label_btn') }}
                <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
                  :content="$t('emp_info_cardNo_popover')">
                  <i class="iconfont icon-remind" slot="reference"></i>
                </el-popover>
              </div>
              <el-input v-model="empForm.cardNo" clearable></el-input>
            </el-form-item>

            <div class="photo" v-if="!isAdd">
              <el-form-item :label="$t('emp_info_form_label9')">
                <ul class="el-upload-list el-upload-list--picture-card">
                  <li
                    class="el-upload-list__item is-success"
                    v-for="(item, index) in empForm.photoIds"
                    :key="index">
                    <span class="upload__icons">
                      <i
                        class="iconfont icon-search"
                        @click="handlePictureCardPreview(item)">
                      </i>
                      <i
                        class="iconfont icon-delete ml10"
                        @click="handleRemovePic(index)">
                      </i>
                    </span>
                    <img
                      class="photo"
                      :src="`${baseUrl}/file/image/${item}`" />
                  </li>
                  <li class="el-upload-list__item upload__li">
                    <el-upload
                      v-if="empForm.photoIds.length < 3"
                      action=""
                      class="avatar-uploader"
                      :show-file-list="false"
                      :before-upload="fileCheck"
                      :http-request="handleUploadImg">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                  </li>
                </ul>
                <div
                  class="el-upload__tip"
                  @click="handleDeviceDialogShow('photograph')"
                  v-if="empForm.photoIds.length < 3">
                  {{ $t('emp_info_photo_label_btn') }}
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover"
                    :content="$t('emp_info_photo_popover')">
                    <i class="iconfont icon-remind" slot="reference"></i>
                  </el-popover>
                </div>
              </el-form-item>
            </div>

            <p class="form__title">{{ $t('emp_info_page_sub_title2') }}</p>
            <el-form-item :label="$t('emp_info_form_label10')" prop="depIds">
              <dep-tree-select
                ref="dep"
                v-model="empForm.depIds"
                :depName="empForm.depName"
                type="2">
              </dep-tree-select>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label11')" prop="roleId">
              <el-select
                v-model="empForm.roleId"
                placeholder=""
                v-leftClear
                filterable
                clearable>
                <el-option
                  v-for="item in select.roles"
                  :key="item.id"
                  :value="item.id"
                  :label="item.roleName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label12')">
              <el-date-picker v-model="empForm.entryTime" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label13')">
              <el-select
                v-model="empForm.empType"
                placeholder=""
                v-leftClear
                clearable>
                <el-option
                  v-for="item in select.type"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label14')" prop="workPlace">
              <el-input v-model="empForm.workPlace" @blur="empForm.workPlace = empForm.workPlace.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('emp_info_form_label15')" prop="tel">
              <el-input v-model="empForm.tel" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="footer__btn">
            <el-button @click="handleCancleSave()">{{ $t('common_cancel') }}</el-button>
            <el-button type="primary" @click="handleSaveInfo()">
              {{ isAdd ? $t('common_add') : $t('common_save') }}
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      :title="$t('emp_info_photo_dialog_title')"
      :visible.sync="dialog.regPicVisible"
      @closed="handleCloseDialog"
      width="520px">
      <div class="dialog__content--form">
        <el-form
          ref="filterForm"
          :rules="empFormRules"
          label-position="top"
          :model="empForm">
          <el-form-item :label="$t('emp_info_form_label8')" prop="cardNo">
            <div class="lable__tip" @click="handleDeviceDialogShow('card')">
              {{ $t('emp_info_cardNo_label_btn') }}
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                :content="$t('emp_info_cardNo_popover')">
                <i class="iconfont icon-remind" slot="reference"></i>
              </el-popover>
            </div>
            <el-input v-model="empForm.cardNo" clearable></el-input>
          </el-form-item>

          <div class="photo">
            <el-form-item :label="$t('emp_info_form_label9')">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  class="el-upload-list__item is-success"
                  v-for="(item, index) in empForm.photoIds"
                  :key="index">
                  <span class="upload__icons">
                    <i class="iconfont icon-search" @click="handlePictureCardPreview(item)"></i>
                    <i class="iconfont icon-delete ml10" @click="handleRemovePic(index)"></i>
                  </span>
                  <img class="photo" :src="`${baseUrl}/file/image/${item}`" />
                </li>
                <li class="el-upload-list__item upload__li">
                  <el-upload
                    v-if="empForm.photoIds.length < 3"
                    action=""
                    class="avatar-uploader"
                    :show-file-list="false"
                    :before-upload="fileCheck"
                    :http-request="handleUploadImg">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </li>
              </ul>
              <div
                class="el-upload__tip"
                @click="handleDeviceDialogShow('photograph')"
                v-if="empForm.photoIds.length < 3">
                {{ $t('emp_info_photo_label_btn') }}
                <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
                  :content="$t('emp_info_photo_popover')">
                  <i class="iconfont icon-remind" slot="reference"></i>
                </el-popover>
              </div>
            </el-form-item>

            <div class="dialog__tip">
              <p>{{ $t('emp_info_photo_dialog_tip1') }}</p>
              <img :src="require('@/assets/images/photo.jpg')" alt="拍照">
              <p>{{ $t('emp_info_photo_dialog_tip2') }}</p>
              <p>{{ $t('emp_info_photo_dialog_tip3') }}</p>
              <p>{{ $t('emp_info_photo_dialog_tip4') }}</p>
            </div>
          </div>
        </el-form>

        <div class="ac pt20">
          <el-button @click="dialog.regPicVisible = false">{{ $t('common_cancel') }}</el-button>
          <el-button type="primary" @click="handleSaveInfo()">{{ $t('common_add') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('emp_info_device_dialog_title')"
      :visible.sync="dialog.deviceVisible"
      width="860px">
      <div>
        <el-form
          ref="filterForm"
          class="page__content--filter"
          label-position="top"
          :inline="true"
          :model="searchParams">
          <el-form-item :label="$t('emp_info_device_dialog_search_label1')">
            <el-input
              v-model="searchParams.deviceName"
              maxlength="32"
              clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('emp_info_device_dialog_search_label2')">
            <el-input
              v-model="searchParams.deviceKey"
              maxlength="32"
              clearable></el-input>
          </el-form-item>

          <el-form-item class="btn__search">
            <el-button icon="iconfont icon-search" @click="handleDeviceQuery('firstPage')">{{ $t('common_search') }}</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="deviceList" height="400px">
          <el-table-column prop="deviceKey" :label="$t('emp_info_device_dialog_table_label1')" min-width="80"></el-table-column>
          <el-table-column prop="deviceName" :label="$t('emp_info_device_dialog_table_label2')" min-width="80"></el-table-column>
          <el-table-column prop="status" :label="$t('emp_info_device_dialog_table_label3')" min-width="80">
            <template slot-scope="scope">
              <div class="fl mr5 point">
                <span
                  :class="{
                    blue: scope.row.status === 1,
                    gray: scope.row.status !== 1
                  }">
                </span>
              </div>
              <span class="fl">{{ filter(scope.row.status, select.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            :label="$t('emp_info_device_dialog_table_label4')"
            min-width="100"
            class-name="table__icon--btn">
            <template slot-scope="scope">
              <el-button type="text" @click="handleStartTask(scope.row)" v-if="!scope.row.expType">
                {{ dialog.deviceType === 'photograph'
                ? $t('emp_info_device_dialog_table_btn1')
                : $t('emp_info_device_dialog_table_btn2') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <m-pagination
          layout="prev, pager, next"
          :handleQueryFun="handleDeviceQuery"
          :pageParams="pageParams">
          <div>
            {{ dialog.deviceType === 'photograph'
            ? $t('emp_info_device_dialog_table_tip1')
            : $t('emp_info_device_dialog_table_tip2') }}
          </div>
        </m-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialog.deviceType === 'photograph'
      ? $t('emp_info_photo_task_dialog_title')
      : $t('emp_info_card_task_dialog_title')"
      :visible.sync="dialog.tipVisible"
      width="560px">
      <div>
        <img
          class="w100"
          :src="require(`@/assets/images/${dialog.deviceType}.jpg`)">
        <p class="ac mt20">
          <span v-if="dialog.deviceType === 'photograph'">{{ $t('emp_info_task_dialog_tip1') }}</span>
          <span v-else>{{ $t('emp_info_task_dialog_tip2') }}</span>
          <span class="ml10 f-blue">{{ time }}s</span>
        </p>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialog.imgVisible" class="img__dialog" width="500px">
      <img class="photo w100" :src="`${baseUrl}/file/image/${dialogImageUrl}`">
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'
import * as rule from '@/libs/rules'
import { roleList } from '@/api/hr/position'
import { deviceList } from '@/api/device/device'
import { DepTreeSelect } from '@/components/tree-select'
import UniubiInput from '@/components/input'

export default {
  name: 'employeeInfo',
  data () {
    return {
      isAdd: true,
      time: 60,
      dialogImageUrl: '',
      searchParams: {
        status: 1,
        cardSupport: true,
        deviceName: '',
        deviceKey: ''
      },
      empForm: {
        name: '',
        gender: '',
        phone: '',
        mail: '',
        workNo: '',
        stageName: '',
        empNo: '',
        cardNo: '',
        depIds: [],
        photoIds: [],
        entryTime: '',
        roleId: '',
        empType: '',
        tel: '',
        workPlace: ''
      },
      empFormRules: {
        name: [
          { required: true, message: this.$t('emp_info_name_rule_msg'), trigger: 'blur' },
          { validator: rule.nameRule, trigger: 'blur' }
        ],
        phone: [
          { validator: rule.phoneRule, trigger: 'blur' }
        ],
        mail: [
          { validator: rule.mailRule, trigger: 'blur' }
        ],
        workNo: [
          { validator: rule.numAndLetterRule, trigger: 'blur' }
        ],
        stageName: [
          { validator: rule.nameRule, trigger: 'blur' }
        ],
        empNo: [
          { validator: rule.numAndLetterRule, trigger: 'blur' }
        ],
        cardNo: [
          { validator: rule.numAndLetterRule, trigger: 'blur' }
        ],
        depIds: [
          { required: true, message: this.$t('emp_info_dep_rule_msg'), trigger: 'change' }
        ],
        workPlace: [
          { validator: rule.addressRule, trigger: 'blur' }
        ],
        tel: [
          { validator: rule.telNumberRule, trigger: 'blur' }
        ]
      },
      dialog: {
        deviceType: 'card',
        imgVisible: false,
        regPicVisible: false,
        deviceVisible: false,
        tipVisible: false
      },
      pageParams: {
        total: 100
      },
      deviceList: [],
      select: {
        status: [
          { value: 0, label: this.$t('emp_info_select_status_label1') },
          { value: 1, label: this.$t('emp_info_select_status_label2') }
        ],
        type: [
          { value: 1, label: this.$t('emp_info_select_type_label1') },
          { value: 2, label: this.$t('emp_info_select_type_label2') },
          { value: 3, label: this.$t('emp_info_select_type_label3') }
        ],
        roles: []
      },
      fileList: [],
      roleInfoReady: false,
      empInfoReady: false,
      empInfoChange: false
    }
  },
  components: {
    DepTreeSelect,
    UniubiInput
  },
  created () {
    this.getRoles()
    const { id, recreate } = this.$route.query
    this.isAdd = !id
    this.empInfoReady = !id
    if (!this.isAdd) this.getEmpInfo()
    if (recreate) this.reCreate()
  },
  mounted () {
    if (this.$route.query.recreate) this.$refs.empForm.validate()
  },
  methods: {
    handleSaveInfo () {
      this.$refs.empForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.empForm
          }
          const apiType = this.empForm.id ? 'editEmployee' : 'addEmployee'
          api[apiType](params).then(res => {
            if (res.success) {
              if (!this.isAdd || this.empForm.id) {
                this.$message.success(`${this.isAdd ? this.$t('emp_info_success1') : this.$t('emp_info_success2')}`)
                this.dialog.regPicVisible = false
                this.$router.go(-1)
              } else {
                this.$confirm(this.$t('emp_info_confirm1'), this.$t('emp_info_confirm12'), {
                  customClass: 'tip__confirm',
                  cancelButtonText: this.$t('emp_info_confirm_btn1'),
                  confirmButtonText: this.$t('emp_info_confirm_btn2'),
                  center: true
                }).then(() => {
                  this.dialog.regPicVisible = true
                  this.empForm.id = res.data
                }, () => {
                  this.$router.go(-1)
                })
              }
            }
          })
        }
      })
    },
    getEmpInfo () {
      return api.getEmployee(this.$route.query.id).then(res => {
        if (res.success) {
          const { photoIds, empRoleVO = {}, empDepVOS = [] } = res.data
          this.empForm = {
            ...this.empForm,
            ...res.data,
            roleId: empRoleVO && empRoleVO.id,
            photoIds: photoIds || [],
            depIds: empDepVOS.map(ele => ele.id)
          }
          this.$refs.dep.init().then(res => {
            setTimeout(() => { this.empInfoReady = true }, 0)
          })
        }
      })
    },
    reCreate () {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (userInfo.empType) {
        const checkedType = this.select.type.filter(ele => ele.label === userInfo.empType)
        userInfo.empType = checkedType[0].value
      }
      if (userInfo.gender) {
        userInfo.gender = userInfo.gender === this.$t('emp_info_gender_label1') ? 1 : userInfo.gender === this.$t('emp_info_gender_label2') ? 2 : ''
      }
      this.empForm = {
        ...userInfo,
        id: '',
        recordDetailId: userInfo.id,
        roleId: '',
        photoIds: [],
        depIds: []
      }
    },
    handleCancleSave () {
      if (this.empInfoChange) {
        this.$confirm(this.$t('emp_info_confirm3'), this.$t('common_save'), {
          confirmButtonText: this.$t('common_save'),
          distinguishCancelAndClose: true,
          center: true
        }).then(() => {
          this.handleSaveInfo()
        }, (type) => {
          if (type === 'cancel') this.$router.go(-1)
        })
      } else {
        this.$router.go(-1)
      }
    },
    handleRemovePic (index) {
      this.empForm.photoIds.splice(index, 1)
    },
    handlePictureCardPreview (fileId) {
      this.dialogImageUrl = fileId
      this.dialog.imgVisible = true
    },
    fileCheck (file) {
      const fileTypeList = ['image/jpeg', 'image/png', 'image/jpg'] // 支持的文件格式
      const fileMaxSize = 2 // 文件大小限制 单位MB
      const fileType = file.type
      const fileSize = file.size
      if (!fileTypeList.includes(fileType)) {
        this.$message.error(this.$t('emp_info_error1'))
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error(this.$t('emp_info_error2'))
        return false
      }
      return true
    },
    handleUploadImg (file) {
      var formFile = new FormData()
      formFile.append('file', file.file)

      api.updateFaceImg(formFile).then(res => {
        if (res.success) {
          this.empForm.photoIds.push(res.data)
        }
      })
    },
    handleDeviceQuery (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.searchParams,
        ...this.pageParams
      }
      deviceList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.deviceList = list
          this.pageParams = { ...this.pageParams, pageNum, total }
        }
      })
    },
    handleStartTask ({ deviceKey }) {
      const apiType = this.dialog.deviceType === 'card' ? 'deviceCard' : 'devicePhoto'
      const params = {
        deviceKey,
        empId: this.empForm.id
      }
      api[apiType](params).then(res => {
        if (res.success) {
          this.dialog.deviceVisible = false
          this.dialog.tipVisible = true
          this.time = 60
          this.timeout()
          this.handleGetTaskData(res.data)
        }
      })
    },
    handleGetTaskData (taskId) {
      api.getTaskData(taskId).then(res => {
        const { success, data, msg } = res
        if (success) {
          const { cardNo, deviceKey, photoId, finished } = data
          if (finished) {
            this.dialog.tipVisible = false
            if (this.dialog.deviceType === 'card') {
              this.empForm.cardNo = cardNo
            } else {
              this.empForm.photoIds.push(photoId)
              this.$confirm(`
                <p><img style="width: 50%;" src="${this.baseUrl}/file/image/${photoId}" /></p>
                <p>${this.$t('emp_info_confirm_text1')}</p>`, this.$t('emp_info_confirm_text2'), {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                cancelButtonText: this.$t('emp_info_confirm_btn3'),
                confirmButtonText: this.$t('common_save'),
                center: true
              }).then(() => {}, (type) => {
                if (type === 'cancel') {
                  if (this.empForm.photoIds.length < 3) {
                    this.handleStartTask({ deviceKey })
                  } else {
                    this.$message.warning(this.$t('emp_info_warning1'))
                  }
                }
              })
            }
          } else {
            if (this.dialog.tipVisible) {
              setTimeout(() => { this.handleGetTaskData(taskId) }, 300)
            }
          }
        } else {
          this.dialog.tipVisible = false
          const { deviceKey } = data
          this.$confirm(msg, this.$t('emp_info_confirm_text2'), {
            confirmButtonText: `${this.dialog.deviceType === 'card' ? this.$t('emp_info_confirm_btn4') : this.$t('emp_info_confirm_btn5')}`,
            cancelButtonText: this.$t('common_confirm'),
            center: true
          }).then(() => {
            this.handleStartTask({ deviceKey })
          }, () => {})
        }
      })
    },
    handleDeviceDialogShow (type) {
      this.searchParams = {
        status: 1,
        cardSupport: true,
        deviceName: '',
        deviceKey: ''
      }
      this.handleDeviceQuery('firstPage')
      this.dialog.deviceVisible = true
      this.dialog.deviceType = type
    },
    getRoles () {
      const params = {
        pageSize: 0,
        pageNum: -1
      }
      roleList(params).then(res => {
        if (res.success) {
          this.select.roles = res.data.list || []
          if (this.$route.query.recreate && this.empForm.role) {
            this.select.roles.forEach(ele => {
              if (ele.roleName === this.empForm.role) {
                this.empForm.roleId = ele.id
              }
            })
          }
          this.roleInfoReady = true
        }
      })
    },
    filter (val, select) {
      if (!val && val !== 0) return
      return select.find(ele => ele.value === val).label
    },
    timeout () {
      setTimeout(() => {
        this.time--
        if (this.time >= 1) {
          this.timeout()
        } else if (this.time === 0) {
          this.dialog.tipVisible = false
          this.$message.warning(`${this.dialog.deviceType === 'photograph' ? this.$t('emp_info_error_text1') : this.$t('emp_info_error_text2')}`)
        }
      }, 1000)
    },
    handleCloseDialog () {
      this.$router.go(-1)
    }
  },
  watch: {
    empForm: {
      handler (newVal, oldVal) {
        if (this.empInfoReady && this.roleInfoReady) {
          this.empInfoChange = true
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-remind{
  color: #c0c4cc;
  cursor: pointer;
}
.lable__tip{
  position: absolute;
  top: -32px;
  left: 40px;
  color: #208ef2;
  cursor: pointer;
}
.content__form/deep/{
  max-width: 1000px;
  // margin:0 auto;
  .form__title{
    font-size: 16px;
    color: #303133;
    padding: 0 0 20px 0;
  }
  .gender{
    width: 220px;
  }
  .footer__btn{
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #e4e7ed;
  }
  .el-form-item{
    margin-bottom: 25px;
  }
  .focus--message{
    white-space: nowrap;
  }
}
.photo/deep/{
  .el-form-item{
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload {
    width: 110px;
    height: 110px;
    line-height: 110px;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    margin: 0 8px 8px 0;
    .el-icon-plus{
      font-size: 20px;
    }
    &:hover {
      border-color: #409EFF;
    }
  }
  .el-upload-list--picture-card{
    display: inline;
  }
  .el-upload__tip{
    width: 130px;
    height: 20px;
    line-height: 20px;
    margin-top: -10px;
    color: #208ef2;
    font-size: 14px;
    cursor: pointer;
  }
  .el-upload-list__item,
  .el-upload--picture-card{
    height: 110px;
    width: 110px;
    line-height: 110px;
    border-radius: 2px;
    background: #fff;
  }
  .el-upload--picture-card{
    margin-bottom: 20px;
    line-height: 120px;
  }
  .el-upload-list__item{
    img{
      width: 100%;
      height: 100%;
      vertical-align: inherit;
    }
    .upload__icons{
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      color: #fff;
      text-align: center;
      .iconfont{
        cursor: pointer;
        font-size: 20px;
      }
    }
    &:hover{
      .upload__icons{
        display: block;
      }
    }
  }
  .upload__li{
    border: none;
  }
}
.dialog__content--form/deep/{
  .el-form-item__label{
    height: 20px;
    line-height: 20px;
    margin-bottom: 4px;
  }
  .dialog__tip img{
    width: 100%;
    padding: 10px 0;
  }
}
.img__dialog/deep/{
  .el-dialog__header{
    border: none;
  }
}
.point{
  line-height: 20px;
  span{
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: transparent;
    &.blue{
      background: #208ef2;
    }
    &.gray{
      background: #c0c4cc;
    }
  }
}
</style>
