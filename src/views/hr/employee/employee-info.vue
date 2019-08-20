<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="handleCancleSave()">
        <i class="iconfont icon-retreat"></i>{{ isAdd ? '添加' : '编辑' }}员工
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
            <p class="form__title">基本信息</p>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="empForm.name" @blur="empForm.name = empForm.name.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别" class="gender">
              <el-radio v-model="empForm.gender" :label="1">男</el-radio>
              <el-radio v-model="empForm.gender" :label="2">女</el-radio>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="empForm.phone" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="empForm.mail" clearable></el-input>
            </el-form-item>
            <el-form-item label="工号" prop="workNo">
              <el-input v-model="empForm.workNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="花名" prop="stageName">
              <el-input v-model="empForm.stageName" @blur="empForm.stageName = empForm.stageName.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item label="员工编号" prop="empNo">
              <uniubi-input
                focus-message="提示：员工编号不可重复，生成后不可修改"
                v-model="empForm.empNo"
                :readonly="!isAdd"
                clearable>
              </uniubi-input>
            </el-form-item>
            <el-form-item label="卡号" v-if="!isAdd" prop="cardNo">
              <div class="lable__tip" @click="handleDeviceDialogShow('card')">
                设备读取卡号
                <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
                  content="设备读取卡号，点击进入，然后选择相应设备，将卡片置于对应设备读卡区域，就会自动读取录入卡号。">
                  <i class="iconfont icon-remind" slot="reference"></i>
                </el-popover>
              </div>
              <el-input v-model="empForm.cardNo" clearable></el-input>
            </el-form-item>

            <div class="photo" v-if="!isAdd">
              <el-form-item label="注册照（确保照片是正脸，且足够清晰，最多3张同一人员注册照）">
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
                      :src="`${baseUrl}/file/image/${item}`"
                      alt="照片" />
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
                  设备录用照片
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover"
                    content="设备拍照录入，只要点击设备拍照，然后选择相应设备，到设备上拍照，就会自动添加照片。">
                    <i class="iconfont icon-remind" slot="reference"></i>
                  </el-popover>
                </div>
              </el-form-item>
            </div>

            <p class="form__title">职业信息</p>
            <el-form-item label="部门" prop="depIds">
              <dep-tree-select
                ref="dep"
                v-model="empForm.depIds"
                :depName="empForm.depName"
                type="2">
              </dep-tree-select>
            </el-form-item>
            <el-form-item label="职称" prop="roleId">
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
            <el-form-item label="入职时间">
              <el-date-picker v-model="empForm.entryTime" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="员工类型">
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
            <el-form-item label="办公地址" prop="workPlace">
              <el-input v-model="empForm.workPlace" @blur="empForm.workPlace = empForm.workPlace.trim()" clearable></el-input>
            </el-form-item>
            <el-form-item label="座机" prop="tel">
              <el-input v-model="empForm.tel" clearable></el-input>
            </el-form-item>
          </el-form>
          <div class="footer__btn">
            <el-button @click="handleCancleSave()">取消</el-button>
            <el-button type="primary" @click="handleSaveInfo()">
              {{ isAdd ? '添加' : '保存' }}
            </el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog
      title="添加注册照/卡号"
      :visible.sync="dialog.regPicVisible"
      @closed="handleCloseDialog"
      width="520px">
      <div class="dialog__content--form">
        <el-form
          ref="filterForm"
          :rules="empFormRules"
          label-position="top"
          :model="empForm">
          <el-form-item label="卡号" prop="cardNo">
            <div class="lable__tip" @click="handleDeviceDialogShow('card')">
              设备读取卡号
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                content="设备读取卡号，点击进入，然后选择相应设备，将卡片置于对应设备读卡区域，就会自动读取录入卡号。">
                <i class="iconfont icon-remind" slot="reference"></i>
              </el-popover>
            </div>
            <el-input v-model="empForm.cardNo" clearable></el-input>
          </el-form-item>

          <div class="photo">
            <el-form-item label="注册照（确保照片是正脸，且足够清晰，最多3张同一人员注册照）">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  class="el-upload-list__item is-success"
                  v-for="(item, index) in empForm.photoIds"
                  :key="index">
                  <span class="upload__icons">
                    <i class="iconfont icon-search" @click="handlePictureCardPreview(item)"></i>
                    <i class="iconfont icon-delete ml10" @click="handleRemovePic(index)"></i>
                  </span>
                  <img class="photo" :src="`${baseUrl}/file/image/${item}`" alt="照片">
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
                设备录用照片
                <el-popover
                  placement="right"
                  width="200"
                  trigger="hover"
                  content="设备拍照录入，只要点击设备拍照，然后选择相应设备，到设备上拍照，就会自动添加照片。">
                  <i class="iconfont icon-remind" slot="reference"></i>
                </el-popover>
              </div>
            </el-form-item>

            <div class="dialog__tip">
              <p>注册照片示例（男生版）</p>
              <img :src="require('@/assets/images/photo.jpg')" alt="拍照">
              <p>照片要求：小于400K；面部区域像素不低于128*128；</p>
              <p>人脸大小占整张照片的1/3以上</p>
              <p>确保所有注册照为同一人，否则无法注册成功</p>
            </div>
          </div>
        </el-form>

        <div class="ac pt20">
          <el-button @click="dialog.regPicVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveInfo()">添加</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="请选择设备"
      :visible.sync="dialog.deviceVisible"
      width="860px">
      <div>
        <el-form
          ref="filterForm"
          class="page__content--filter"
          label-position="top"
          :inline="true"
          :model="searchParams">
          <el-form-item label="设备名称">
            <el-input
              v-model="searchParams.deviceName"
              maxlength="32"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="设备序列号">
            <el-input
              v-model="searchParams.deviceKey"
              maxlength="32"
              clearable></el-input>
          </el-form-item>

          <el-form-item class="btn__search">
            <el-button icon="iconfont icon-search" @click="handleDeviceQuery('firstPage')">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="deviceList" height="400px">
          <el-table-column prop="deviceKey" label="设备序列号" min-width="80"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称" min-width="80"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <span
                class="point mr5"
                :class="{
                  blue: scope.row.status === 1,
                  gray: scope.row.status !== 1
                }">
              </span>
              <span>{{ filter(scope.row.status, select.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作"
            min-width="100"
            class-name="table__icon--btn">
            <template slot-scope="scope">
              <el-button type="text" @click="handleStartTask(scope.row)" v-if="!scope.row.expType">
                {{ dialog.deviceType === 'photograph' ? '拍照' : '读卡' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <m-pagination
          layout="prev, pager, next"
          :handleQueryFun="handleDeviceQuery"
          :pageParams="pageParams">
          <div>
            只展示具备{{ dialog.deviceType === 'photograph' ? '拍照注册' : '读取卡号' }}功能的设备
          </div>
        </m-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :title="dialog.deviceType === 'photograph' ? '设备拍照注册' : '设备读取卡号'"
      :visible.sync="dialog.tipVisible"
      width="560px">
      <div>
        <img
          class="w100"
          :src="require(`@/assets/images/${dialog.deviceType}.jpg`)"
          alt="拍照">
        <p class="ac mt20">
          <span v-if="dialog.deviceType === 'photograph'">进入拍照模式，请站立在设备面前</span>
          <span v-else>请将IC/身份证放在刷卡区域内</span>
          <span class="ml10 f-blue">{{ time }}s</span>
        </p>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialog.imgVisible" class="img__dialog" width="500px">
      <img class="photo w100" :src="`${baseUrl}/file/image/${dialogImageUrl}`" alt="照片">
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
          { required: true, message: '请输入姓名', trigger: 'blur' },
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
          { required: true, message: '请选择部门', trigger: 'change' }
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
          { value: 0, label: '离线' },
          { value: 1, label: '在线' }
        ],
        type: [
          { value: 1, label: '正式员工' },
          { value: 2, label: '临时工' },
          { value: 3, label: '实习生' }
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
                this.$message.success(`${this.isAdd ? '添加完成！' : '编辑员工成功！'}`)
                this.dialog.regPicVisible = false
                this.$router.go(-1)
              } else {
                this.$confirm('下次也可以在员工编辑中补充', '添加人员成功，是否立即补充卡号、注册照信息', {
                  customClass: 'tip__confirm',
                  cancelButtonText: '下次再说',
                  confirmButtonText: '立即补充',
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
        userInfo.gender = userInfo.gender === '男' ? 1 : userInfo.gender === '女' ? 2 : ''
      }
      this.empForm = {
        ...userInfo,
        roleId: '',
        photoIds: [],
        depIds: []
      }
    },
    handleCancleSave () {
      if (this.empInfoChange) {
        this.$confirm('是否保存已修改信息', '保存', {
          confirmButtonText: '保存',
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
        this.$message.error('文件格式不正确，请重新选择')
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error('文件过大，请重新选择')
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
                <p>照片合格</p>`, '结果', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                cancelButtonText: '再拍一张',
                confirmButtonText: '保存',
                center: true
              }).then(() => {}, (type) => {
                if (type === 'cancel') {
                  if (this.empForm.photoIds.length < 3) {
                    this.handleStartTask({ deviceKey })
                  } else {
                    this.$message.warning('注册照最多3张！')
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
          this.$confirm(msg, '结果', {
            confirmButtonText: `${this.dialog.deviceType === 'card' ? '重新读取' : '重新拍摄'}`,
            cancelButtonText: '确定',
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
</style>
